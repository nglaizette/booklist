import { env } from "$env/dynamic/private";
import { queryBooks, runMultiUpdate } from "./dbUtils";
import type { Book } from "./types";

const bookFields = [
  "_id",
  "title",
  "userId",
  "authors",
  "tags",
  "subjects",
  "isbn",
  "publisher",
  "publicationDate",
  "isRead",
  "smallImage",
  "smallImagePreview"
];

const bookProjections = bookFields.reduce<{ [k: string]: 1 }>((result, field) => {
  result[field] = 1;
  return result;
}, {});

export const searchBooks = async (userId: string, search: string) => {
  userId = userId || "";
  const httpStart = +new Date();

  return queryBooks({
    pipeline: [
      { $match: { title: { $regex: search || "", $options: "i" }, userId } },
      { $project: bookProjections },
      { $addFields: { dateAdded: { $toDate: "$_id" } } },
      { $limit: 50 },
      { $sort: { title: 1 } }
    ]
  })
    .then(books => {
      const httpEnd = +new Date();
      console.log("HTTP time books", httpEnd - httpStart);

      const arrayFieldsToInit = ["authors", "subjects", "tags"] as (keyof Book)[];
      books.forEach(book => {
        arrayFieldsToInit.forEach(arr => {
          if (!Array.isArray(book[arr])) {
            (book as any)[arr] = [] as string[];
          }
        });

        const date = new Date(book.dateAdded);
        book.dateAddedDisplay = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      });
      return books;
    })
    .catch(err => {
      console.log({ err });
    });
};

export const booksSubjectsDump = async (userId: string) => {
  userId = userId || "";
  const httpStart = +new Date();

  return queryBooks({
    pipeline: [
      { $match: { userId, "subjects.0": { $exists: true } } },
      { $group: { _id: "$subjects", count: { $count: {} } } },
      { $project: { _id: 0, subjects: "$_id", count: 1 } }
    ]
  })
    .then(records => {
      const httpEnd = +new Date();
      console.log("HTTP time books", httpEnd - httpStart);

      return records;
    })
    .catch(err => {
      console.log({ err });
    });
};

export const updateBook = async (userId: string, book: any) => {
  userId = userId || "";
  const { _id, title, tags, subjects, authors } = book;

  return fetch(env.MONGO_URL + "/action/updateOne", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": env.MONGO_URL_API_KEY
    },
    body: JSON.stringify({
      collection: "books",
      database: "my-library",
      dataSource: "Cluster0",
      filter: { _id: { $oid: _id }, userId },
      update: { $set: { title, tags, subjects, authors } }
    })
  })
    .then(res => res.json())
    .catch(err => {
      console.log({ err });
    });
};

type BulkUpdate = {
  _ids: string[];
  add: string[];
  remove: string[];
};

export const updateBooksSubjects = async (userId: string, updates: BulkUpdate) => {
  userId = userId || "";
  const { _ids, add, remove } = updates;

  if (add.length) {
    await runMultiUpdate("books", {
      filter: { _id: { $in: _ids.map(_id => ({ $oid: _id })) } },
      update: {
        $addToSet: { subjects: { $each: add } }
      }
    });
  }
  if (remove.length) {
    await runMultiUpdate("books", {
      filter: { _id: { $in: _ids.map(_id => ({ $oid: _id })) }, userId },
      update: {
        $pull: { subjects: { $in: remove } }
      }
    });
  }
};

export const updateBooksTags = async (userId: string, updates: BulkUpdate) => {
  userId = userId || "";
  const { _ids, add, remove } = updates;

  if (add.length) {
    await runMultiUpdate("books", {
      filter: { _id: { $in: _ids.map(_id => ({ $oid: _id })) }, userId },
      update: {
        $addToSet: { tags: { $each: add } }
      }
    });
  }
  if (remove.length) {
    await runMultiUpdate("books", {
      filter: { _id: { $in: _ids.map(_id => ({ $oid: _id })) } },
      update: {
        $pull: { tags: { $in: remove } }
      }
    });
  }
};
