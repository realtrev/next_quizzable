import { ReactNode } from "react";
import HomeNavbar from "./HomeNavbar";
import Footer from "./Footer";

export const metadata = {
  title: "Home | Quizzable",
  description: "Explore your personalized study library.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen w-full bg-background-1">
      <HomeNavbar />
      <div className="h-96 w-full bg-gradient-to-tl from-secondary to-tertiary">
        <div className="body flex h-full w-full items-center">
          <h1 className="w-1/2">
            Explore your <span className="text-primary">personalized</span>{" "}
            study library
          </h1>
        </div>
      </div>
      <main>{children}</main>
      <Footer />
    </main>
  );
}
