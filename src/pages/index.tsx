import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Quizzable</title>
        <meta
          name="description"
          content="Quizzable is an app designed to help you study."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="select-none text-6xl font-medium tracking-tight text-primary">
            Quizzable
          </h1>
          <p className="select-none text-xl font-semibold tracking-tight text-subheading">
            An app designed to help you study.
          </p>
        </div>
      </main>
    </>
  );
};

export default Home;
