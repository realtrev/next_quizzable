import { UserPlusIcon } from "@heroicons/react/24/solid";

import "./style.css";

import Image from "next/image";
import Link from "next/link";
import Footer from "./Footer";
import Navbar from "./Navbar";
import SearchBar from "./SearchBar";
import StudySet from "./components/StudySet";
import InteractiveFlashcards from "./InteractiveFlashcards";
import type { User } from "../lib/types";

export const metadata = {
  title: "Find new and engaging ways to study | Quizzable",
  description: "Quizzable is study tool designed to help you learn faster.",
};

export default function Page() {
  return (
    <div className="cursor-default bg-background-1">
      <main className="min-h-screen w-full">
        <section className="relative">
          <div className="absolute top-0 left-0 z-0 flex h-full w-full -scale-x-100 overflow-hidden bg-green-50 bg-[url('https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80')] bg-cover bg-center opacity-5"></div>

          <Navbar />

          <section
            id="hero"
            className="body relative flex items-center py-64 pt-40"
          >
            <div className="z-10 mx-auto w-2/3 text-center lg:mx-0 lg:w-3/5 lg:text-left">
              <h1>
                <span className="text-primary">Studying</span> just got a whole
                lot easier
              </h1>
              <h4 className="mt-14 mb-16">
                Find new and engaging ways to study using Quizzable
              </h4>
              <SearchBar />
            </div>

            <InteractiveFlashcards />
          </section>
          <div className="custom-shape-divider-bottom-1677355351">
            <svg
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                opacity=".25"
                className="fill-background-3"
              ></path>
              <path
                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                opacity=".5"
                className="fill-background-3"
              ></path>
              <path
                d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                className="fill-background-3"
              ></path>
            </svg>
          </div>
        </section>

        <section className="rounded-y-3xl relative z-20 overflow-hidden border-background-4 bg-gradient-to-t from-background-1 to-background-3 py-40">
          <div className="body mx-auto mb-20 text-center">
            <h6>FEATURES</h6>
            <h2>Why use Quizzable?</h2>
            <p className="mx-auto mt-10 w-1/2">
              {
                "Quizzable is a flashcard app that makes studying fun and engaging. It's a great way to memorize information and prepare for exams."
              }
            </p>
          </div>
          <div id="features" className="body grid grid-cols-3 gap-5">
            <div className="feature-card blurry-shadow h-[20rem] bg-gradient-to-tr from-primary to-teal py-12 shadow-primary">
              <Image
                src="/undraw_knowledge_re_5v9l.svg"
                alt="studying"
                height={20}
                width={140}
                className="mx-auto mb-5"
              />
              <h4>Flashcards</h4>
              <p className="h-[3rem]">
                A simple and effective way to memorize information through
                digital flashcards.
              </p>
            </div>
            <div className="feature-card blurry-shadow h-[20rem] bg-gradient-to-t from-secondary to-tertiary py-12 shadow-secondary">
              <Image
                src="/undraw_video_game_night_8h8m.svg"
                alt="game controller"
                height={20}
                width={140}
                className="mx-auto mb-5"
              />
              <h4>Study games</h4>
              <p className="h-[3rem]">
                Engaging and fun games to help reinforce learning and make
                studying more enjoyable.
              </p>
            </div>
            <div className="feature-card blurry-shadow h-[20rem] bg-gradient-to-tl from-primary to-teal py-12 shadow-primary">
              <Image
                src="/undraw_preferences_re_49in.svg"
                alt="preferences"
                height={20}
                width={160}
                className="mx-auto mb-5"
              />
              <h4>Multiple study modes</h4>
              <p className="h-[3rem]">
                Over 10 customizable study modes designed to cater to individual
                learning preferences and styles.
              </p>
            </div>
            <div className="feature-card blurry-shadow left-2.5 h-[20rem] translate-x-1/2 bg-gradient-to-tr from-primary to-secondary py-12 shadow-primary">
              <Image
                src="/undraw_in_sync_re_jlqd.svg"
                alt="selection"
                height={20}
                width={170}
                className="mx-auto mb-5"
              />
              <h4>Synchronized progress</h4>
              <p className="h-[3rem]">
                Seamless tracking of progress across all devices and platforms
                for a hassle-free studying experience.
              </p>
            </div>
            <div className="feature-card blurry-shadow group left-2.5 h-[20rem] translate-x-1/2 bg-gradient-to-tl from-secondary to-tertiary py-12 shadow-secondary">
              <Image
                src="/undraw_asset_selection_re_k5fj.svg"
                alt="selection"
                height={20}
                width={160}
                className="mx-auto mb-5"
              />
              <h4>Get started in seconds</h4>
              <p className="h-[3rem]">
                Effortlessly import study sets from other sites to begin
                studying right away.
              </p>
            </div>
          </div>
        </section>

        <section
          id="top-study-sets"
          className="relative z-20 overflow-hidden bg-background-1 py-40"
        >
          <div className="body mx-auto grid grid-cols-3 gap-5">
            <div className="col-span-1">
              <h6>TOP SETS</h6>
              <h2>Our Community</h2>
              <p>
                Take a look at some of the most popular study sets on Quizzable,
                made by our community of users.
              </p>
            </div>
            {[
              {
                title: "Chemistry Basics",
                description:
                  "A beginner's guide to chemistry terminology and concepts.",
                terms: 25,
                author: "Sarah Johnson",
              },
              {
                title: "Spanish Vocabulary",
                description:
                  "Learn Spanish words and phrases for everyday situations.",
                terms: 50,
                author: "Juan Hernandez",
              },
              {
                title: "World Capitals",
                description:
                  "Test your knowledge of capital cities from around the globe.",
                terms: 30,
                author: "Alexandra Lee",
              },
              {
                title: "US Presidents",
                description:
                  "A study set on the names and order of the United States presidents.",
                terms: 45,
                author: "Emily Chen",
              },
              {
                title: "SAT Vocabulary",
                description:
                  "Improve your SAT score by learning common vocabulary words used on the test.",
                terms: 100,
                author: "Daniel Kim",
              },
            ].map((studySet, i) => (
              <StudySet
                key={i}
                studySet={{
                  id: "#",
                  title: studySet.title,
                  description: studySet.description,
                  terms: studySet.terms,
                  author: {
                    username: studySet.author,
                  } as User,
                }}
              />
            ))}
          </div>
          <div className="bg-gradient-radial pointer-events-none absolute top-1/2 left-1/2 -z-50 h-[100%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full from-primary opacity-20"></div>
          <div className="custom-shape-divider-bottom-1677420221">
            <svg
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                className="fill-background-2"
              ></path>
            </svg>
          </div>
        </section>

        <section
          className="relative z-20 overflow-hidden bg-background-2 py-40"
          id="about"
        >
          <div className="body grid grid-cols-3 gap-5">
            <div>
              <h6>MEET THE TEAM</h6>
              <h2>About Us</h2>
            </div>
            <div className="blurry-shadow col-span-2 flex gap-5 rounded-xl bg-gradient-to-tl from-primary to-secondary p-5 shadow-primary">
              <div className="flex w-40 shrink-0 flex-col items-center gap-5 rounded-md bg-black bg-opacity-10 p-5">
                <div className="aspect-square w-20 rounded-full bg-[url('https://avatars.githubusercontent.com/u/65660736?v=4')] bg-contain shadow-lg"></div>
                <h4 className="text-white">Paridax</h4>
                <h6 className="text-center text-white">PROJECT LEAD</h6>
              </div>
              <div className="mr-2 flex grow flex-col justify-center gap-5 text-left text-white">
                <p className="mt-0">
                  {`I'm a high school student studying computer science. I love
                  web design and development and I'm currently learning Next.js.`}
                </p>
                <p className="mt-0">
                  {`The idea for Quizzable came about when I realized that there
                  weren't really any free flashcard websites that I liked. I
                  wanted to create a website that was easy to use and had a
                  clean, modern design.`}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-20 overflow-hidden bg-background-2 py-40 pb-64">
          <div className="body flex flex-col items-center justify-center gap-10">
            <div className="w-full text-center">
              <h6>GET STARTED</h6>
              <h2>Ready to get started?</h2>
              <p className="mx-auto mt-10 w-1/2 text-center">
                Sign up for a free account to start creating and studying
                flashcards.
              </p>
            </div>
            <Link
              href="/signup"
              className="font-nav blurry-shadow-sm group mt-16 flex items-center gap-2 rounded-2xl bg-gradient-to-tl from-secondary to-tertiary p-4 px-10 text-lg text-white shadow-secondary duration-200 hover:-translate-y-2 hover:brightness-110"
            >
              <UserPlusIcon className="text-2xl text-white duration-200" />
              Create an account
            </Link>
          </div>
          <div className="custom-shape-divider-bottom-1677354881">
            <svg
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                className="fill-primary"
              ></path>
            </svg>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
