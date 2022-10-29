import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter";

const dynamoConfig /*: DynamoDBClientConfig*/ = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID /*as string*/,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY /*as string*/
  },
  region: "us-east-1"
};

const client = DynamoDBDocument.from(new DynamoDB(dynamoConfig), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true
  }
});

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_SECRET
    })
  ],

  secret: process.env.NEXTAUTH_SECRET,

  adapter: DynamoDBAdapter(client, { tableName: process.env.DYNAMO_AUTH_TABLE }),

  // async jwt({ token, account }) {
  //   // Persist the OAuth access_token to the token right after signin
  //   console.log({ token, account });
  //   return token;
  // },

  callbacks: {
    async session({ session, user, token }) {
      console.log("SESSION", { session, user, token }, "\n-------\n");
      session.userId = user.id;
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("JWT", { token, user, account, profile, isNewUser }, "\n-------\n");
      return token;
    }
  }

  // session: {
  //   strategy:
  // }

  // async session({ session, token, user }) {
  //   console.log({ session, token, user });
  //   return session;
  // }
};

export default NextAuth(authOptions);
