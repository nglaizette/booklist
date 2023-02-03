import { MongoClient } from "mongodb";
import { getSecrets } from "./getSecrets";

export default async () => {
  const IS_DEV = process.env.stage === "dev";
  const secrets = await getSecrets();
  const connString = secrets[IS_DEV ? "mongo-connection-string-dev" : "mongo-connection-string"];
  const dbName = secrets["db-name"];

  return MongoClient.connect(connString).then(client => client.db(dbName));
};

export async function getDbConnection() {
  const IS_DEV = process.env.stage === "dev";
  const secrets = await getSecrets();
  const connString = secrets[IS_DEV ? "mongo-connection-string-dev" : "mongo-connection-string"];
  const dbName = secrets["db-name"];

  const client = await MongoClient.connect(connString);
  const db = await client.db(dbName);

  return { db, client };
}
