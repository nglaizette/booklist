//import path from "path";

import { v4 as uuid } from "uuid";
//import sharp from "sharp";
//import { getPlaiceholder } from "plaiceholder";

//import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import { db, getDeletePacket, getPutPacket, TABLE_NAME } from "../../util/dynamoHelpers";

import { getPendingCount, getScanItemBatch, getStatusCountUpdate, ScanItem } from "./data-helpers";
import { getBookFromIsbnDbData, isbnDbLookup } from "./isbn-db-utils";
import { getScanResultKey } from "./key-helpers";

//import downloadFromUrl from "../../util/downloadFromUrl";
//import { getDbConnection } from "../../util/getDbConnection";
import { sendWsMessageToUser } from "./ws-helpers";

//import { handleCover } from "../../util/handleCover";

type BookLookupPacket = {
  pk: string;
  sk: string;
  scanItems: ScanItem[];
};

export const runBookLookupIfAvailable = async () => {
  const key = `BookLookup#${uuid()}`;

  let scanPacket;

  try {
    const scanItems: ScanItem[] = await getScanItemBatch();

    if (!scanItems.length) {
      console.log("No scan items remaining");
      return;
    }

    console.log("Scan items found", scanItems.length, scanItems);

    const timestamp = +new Date();

    scanPacket = {
      pk: "BookLookup",
      sk: key,
      scanItems,
      expires: Math.round(timestamp / 1000) + 60 * 60 * 24 // 1 day
    };

    console.log("SCAN PACKET SETUP", scanItems);

    await db.transactWrite(
      {
        TransactItems: [
          /*...scanItems.map(({ pk, sk }) => ({
            Delete: {
              Key: { pk, sk },
              TableName: TABLE_NAME,
              ConditionExpression: "attribute_exists(#sk)",
              ExpressionAttributeNames: {
                "#sk": "sk"
              }
            }
          })),*/
          {
            Put: getPutPacket(scanPacket)
          }
        ]
      },
      3
    );
    console.log("Setup success, doing lookup");
    await doLookup(scanPacket);
  } catch (err) {
    console.log("Scan packet setup transaction error", err);
  }
};

export const doLookup = async (scanPacket: BookLookupPacket) => {
  const scanItems: ScanItem[] = scanPacket.scanItems;

  await lookupBooks(scanPacket.scanItems);

  return;

  const userUpdateMap = scanItems.reduce((hash, { userId }) => {
    if (!hash.hasOwnProperty(userId)) {
      hash[userId] = 0;
    }
    hash[userId]--;
    return hash;
  }, {});

  console.log("Post lookup - Updating status counts", JSON.stringify(userUpdateMap));

  await db.transactWrite({
    TransactItems: [
      {
        Delete: getDeletePacket({ pk: scanPacket.pk, sk: scanPacket.sk })
      },
      ...Object.entries(userUpdateMap).map(([userId, amount]) => {
        return {
          Update: getStatusCountUpdate(userId, amount)
        };
      })
    ]
  });
  console.log("Post lookup - Updating status counts Complete", JSON.stringify(userUpdateMap));

  for (const [userId] of Object.entries(userUpdateMap)) {
    console.log("Getting new pending count for", userId);
    const pendingCount = await getPendingCount(userId, true);
    console.log("Pending count for", userId, pendingCount, "Sending ws message");
    await sendWsMessageToUser(userId, { type: "pendingCountSet", pendingCount });
  }
};

const wait = ms => new Promise(res => setTimeout(res, ms));

export const lookupBooks = async (scanItems: ScanItem[]) => {
  try {
    const startTime = +new Date();
    const userIds = [...new Set(scanItems.map(entry => entry.userId))];

    const allResults = await isbnDbLookup(scanItems);
    const allBookDownloads = [];

    for (const book of allResults) {
      for (const scanInput of scanItems) {
        if (scanInput.pk && (scanInput.isbn === book.isbn13 || scanInput.isbn === book.isbn)) {
          allBookDownloads.push(
            (async function () {
              try {
                const newBook = await getBookFromIsbnDbData(book, scanInput.userId);
                const idx = scanItems.indexOf(scanInput);
                (scanItems as any)[idx] = newBook;
              } catch (er) {}
            })()
          );
        }
      }
    }

    await Promise.race([wait(5000), Promise.all(allBookDownloads)]);

    const userMessages = userIds.reduce<{ [k: string]: { results: any[] } }>((hash, userId) => {
      hash[userId] = { results: [] };
      return hash;
    }, {});

    console.log("Book lookup results", JSON.stringify(scanItems));
    for (const newBookMaybe of scanItems) {
      const [pk, sk, expires] = getScanResultKey(newBookMaybe.userId);

      // if (!newBookMaybe.pk) {
      //   const { db: mongoDb, client: mongoClient } = await getDbConnection();
      //   await mongoDb.collection("books").insertOne(newBookMaybe);
      //   await mongoClient.close();

      //   userMessages[newBookMaybe.userId].results.push({ success: true, item: newBookMaybe });
      //   const { title, smallImage } = newBookMaybe as any;
      //   await db.put(getPutPacket({ pk, sk, success: true, title, smallImage, expires }));
      // } else {
      //   userMessages[newBookMaybe.userId].results.push({ success: false, item: { _id: uuid(), title: `Failed lookup for ${newBookMaybe.isbn}` } });
      //   await db.put(getPutPacket({ pk, sk, success: false, isbn: newBookMaybe.isbn, expires }));
      // }
    }

    console.log("---- FINISHED. ALL SAVED ----");

    for (const [userId, packet] of Object.entries(userMessages)) {
      sendWsMessageToUser(userId, { type: "scanResults", packet });
    }

    const endTime = +new Date();

    console.log("---- Time elapsed .... ----", endTime - startTime);

    return { success: true };
  } catch (err) {
    console.log("BOOK LOOKUP ERROR", err);
    return { success: false, err };
  }
};
