import Head from "next/head";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";

import styles from "../styles/Home.module.css";

export default function Home() {
  const { data: session } = useSession();

  console.log("client", { session });

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!session ? (
        <main className={styles.main}>
          Hello World!!!
          <br />
          <button onClick={() => signIn()}>Sign in</button>
          <button onClick={() => fetch("/api/hello")}>Hit endpoint</button>
        </main>
      ) : (
        <main className={styles.main}>
          Welcome, user!
          <button onClick={() => signOut()}>Sign out</button>
          <button onClick={() => fetch("/api/hello")}>Hit endpoint</button>
        </main>
      )}
    </div>
  );
}
