import Link from "next/link";

import "../style.css";

function Footer() {
  return (
    <footer className="flex bg-background-2 py-16">
      <div className="mx-auto grid shrink grid-cols-2 items-center justify-center gap-16 px-20">
        <div className="grid grid-cols-2 grid-rows-3 gap-5">
          {[
            { link: "Home", href: "/" },
            { link: "Contact", href: "mailto:contact@trevord.live" },
            { link: "Support Quizzable", href: "/support" },
            { link: "GitHub", href: "https://github.com/paridax" },
            { link: "Feedback", href: "/feedback" },
            { link: "Help", href: "mailto:contact@trevord.live" },
          ].map((link, i) => (
            <Link
              href={link.href}
              key={"link" + i.toString()}
              className="button w-40"
            >
              {link.link}
            </Link>
          ))}
        </div>
        <div className="text-nav flex flex-col gap-5">
          <p className="text-xs text-paragraph">
            Website created by{" "}
            <Link
              href="https://trevord.live/"
              className="rounded-md bg-white bg-opacity-5 p-0.5 text-white"
            >
              Paridax
            </Link>
            ,<br />
            using Next.js and TailwindCSS.
          </p>
          <p className="text-xs text-paragraph">
            Quizzable © 2023. All rights reserved.
          </p>
          <p className="text-xs text-paragraph">
            <Link href="/terms" className="font-medium hover:text-white">
              Terms of Service
            </Link>{" "}
            •{" "}
            <Link href="/privacy" className="font-medium hover:text-white">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

export { Footer as default };
