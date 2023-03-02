"use client";
import Link from "next/link";

import "./global.css";
import "./style.css";

function Navbar() {
  return (
    <div className="glass z-30 w-full">
      <nav id="navbar" className="body h-28">
        <Link href="#" className="wordmark blurry-shadow-sm shadow-primary">
          Quizzable
        </Link>
        <ul>
          <Link href="mailto:contact@trevord.live" className="button">
            Contact
          </Link>
          <Link href="#" className="button">
            Support Quizzable
          </Link>
          <Link href="/login" className="button">
            Login
          </Link>
          <Link href="/signup" className="button primary">
            Sign up
          </Link>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
