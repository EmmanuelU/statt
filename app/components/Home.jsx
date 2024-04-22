"use client";
import NewBackgroundGradient from "./NewBackgroundGradient";
import React from "react";

import About from "./About";
import { config } from "../constants/constants";


export default function Home(props) {

  return (
    <>
      <NewBackgroundGradient
        video={config.background.video}
        gradient="radial-gradient(circle at 24.1% 68.8%, rgb(50, 50, 50) 0%, rgb(0, 0, 0) 99.4%)"
      />

      <main className="bg-black text-white min-h-[calc(100dvh)]">
        <span id="mainsection">
          <About />
        </span>
      </main>
    </>
  );
}