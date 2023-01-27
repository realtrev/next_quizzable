import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <div className="bg-white">
      <Head>
        <title>Quizzable</title>
        <meta
          name="description"
          content="Quizzable is an app designed to help you study."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
          <h1 className="select-none text-6xl font-medium tracking-tight text-primary">
            Quizzable
          </h1>
          <div>
            <p className="mt-6 select-none text-lg font-semibold text-subheading">
              Log in
            </p>
          </div>
          <div className="flex flex-col">
            <div>
              <button
                type="button"
                className="flex h-12 w-80 items-center justify-center rounded border border-gray-200 bg-opacity-0 px-3 text-sm font-medium text-subheading outline-none placeholder:text-gray-300 hover:bg-offwhite focus:border-primary"
              >
                <span className="ml-5">Continue with Google</span>
              </button>
            </div>
            <div>
              <button
                type="button"
                className="mt-2 flex h-12 w-80 items-center justify-center rounded border border-gray-200 bg-opacity-0 px-3 text-sm font-medium text-subheading outline-none placeholder:text-gray-300 hover:bg-offwhite focus:border-primary"
              >
                <span className="ml-5">Continue with Microsoft</span>
              </button>
            </div>
            <div>
              <p className="mt-6 w-full select-none text-center text-xs font-medium text-gray-500">
                OR
              </p>
            </div>
            <div>
              <label
                htmlFor="email"
                className="select-none text-xs font-bold text-subheading"
              >
                EMAIL
              </label>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                placeholder="Enter your email or username"
                className="block h-12 w-80 rounded border border-gray-200 bg-opacity-0 px-3 text-sm font-medium text-subheading outline-none placeholder:text-gray-300 focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="select-none text-xs font-bold text-subheading"
              >
                PASSWORD
              </label>
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className="block h-12 w-80 rounded border border-gray-200 bg-opacity-0 px-3 text-sm font-medium text-subheading outline-none placeholder:text-gray-300 focus:border-primary"
              />
            </div>
            <div>
              <button
                type="button"
                className="mt-2 flex h-12 w-80 items-center justify-center rounded bg-primary px-3 text-sm font-medium text-white outline-none transition-all duration-200 placeholder:text-gray-300 hover:brightness-75 focus:border-primary focus:brightness-75"
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
