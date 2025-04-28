import React from "react";
import Navbar from "./Components/Navbar";

export default function Page() {
  return (
    <div>
      <Navbar bgNav="bg-transparent" />
      <div className="relative z-0 min-h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute z-0 w-full h-full object-cover"
        >
          <source src="/BG3.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 z-1 bg-black opacity-60"></div>

        <div className="relative z-10">
          <section className="Hero min-h-screen flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl md:text-8xl mt-6 font-semibold">
                Temukan Destinasi Wisata Anda
              </h1>
              <h1 className="text-4xl md:text-8xl font-semibold">Bersama Jumbo</h1>

              <div className="flex justify-center">
                <p className="mt-6 w-2/4 text-gray-400">
                  Temukan destinasi impian Anda dengan Jumbo. Kami menyediakan
                  rekomendasi perjalanan terbaik yang disesuaikan dengan
                  preferensi Anda.
                </p>
              </div>
              <a href="/Rekomendasi " className="btn rounded-lg btn-primary mt-10">
                Temukan Rekomendasi{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                  />
                </svg>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
