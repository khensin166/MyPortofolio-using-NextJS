"use client";
import { BsFillMoonStarsFill } from "react-icons/bs";
import Link from "next/link";
import { AiFillLinkedin, AiFillYoutube, AiFillInstagram } from "react-icons/ai";
import deved from "../public/dev-ed-wave.png";
import code from "../public/code.png";
import design from "../public/design.png";
import consulting from "../public/consulting.png";
import Image from "next/image";
import web1 from "../public/web1.png";
import web2 from "../public/web2.png";
import web3 from "../public/web3.png";
import web4 from "../public/web4.png";
import web5 from "../public/web5.png";
import web6 from "../public/web6.png";
import { useState } from "react";
import Typewriter from "typewriter-effect";

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  return (
    <div className={darkMode ? "dark" : ""}>
      <main className="bg-white px-10 dark:bg-gray-900 md:px-20 lg:px-40">
        {/* <header className="bg-transparent absolute top-0 left-0 w-full flex items-center z-10">
          <div className="container">
            <div className="flex items-center">
              <div className="px-4">
                <a href="#home" className="font-bold text-lg text-primary block py-6">kenanBukit</a>
              </div>
              <div className="flex items-center px-4">
                <button id="hamburger" name="hamburger" type="button" className="block absolute right-4" >
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
              </div>
            </div>
          </div>
        </header> */}

        <section className="min-h-screen" id="home">
          <nav className="py-10 mb-12 flex justify-between dark:text-gray-300">
            <h1 className="text-xl font-burtons">Kenan Tomfie Bukit</h1>
            <ul className="flex items-center">
              <li>
                <BsFillMoonStarsFill
                  onClick={() => setDarkMode(!darkMode)}
                  className="cursor-pointer text-2xl"
                />
              </li>
              <li>
                <Link
                  href="#"
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-4 py-2 rounded-md ml-8 hover:opacity-80 transition duration-300 ease-in-out "
                >
                  Resume
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 flex items-center justify-center">
              <div className="mx-auto bg-gradient-to-b from-teal-500 rounded-full w-80 h-80 relative overflow-hidden md:mt-20 md:h-96 md:w-96">
                <Image alt="" src={deved} layout="fill" objectFit="cover" />
              </div>
            </div>
            <div className="w-full md:w-1/2 self-center p-10">
              <div className="text-center md:text-left justify-center md:mt-28 ">
                <h4 className=" text-2xl text-gray-800 font-bold dark:text-white">
                  Hello 👋, i`m
                </h4>
                <h2 className="text-4xl py-2 text-teal-600 font-medium dark:text-teal-400 md:text-6xl font-poppins">
                  Kenan Tomfie Bukit
                </h2>
                <Typewriter
                  options={{
                    strings: [
                      "Developer & Designer.",
                      "Freelancer providing services.",
                    ],
                    autoStart: true,
                    loop: true,
                    wrapperClassName:
                      "text-2xl py-2 dark:text-white md:text-3xl",
                  }}
                />
                <p className="text-md py-5 leading-8 text-gray-800 dark:text-gray-200 max-w-xl mx-auto md:text-xl">
                  Thank you for checking out my personal portfolio.
                </p>
                <div className="text-5xl flex justify-center md:justify-start gap-16 py-3 text-gray-600 dark:text-gray-400">
                  <Link
                    href="https://www.instagram.com/kenan_bukit/"
                    target="_blank"
                  >
                    <AiFillInstagram />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/kenan-tomfie0604"
                    target="_blank"
                  >
                    <AiFillLinkedin />
                  </Link>
                  <Link
                    href="https://youtube.com/@kenantomfiebukit989"
                    target="_blank"
                  >
                    <AiFillYoutube />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="pt-32 pb-32 md:pt-20 md:pb-20 lg:pt-20 lg:pb-20 "
        >
          <div className="container">
            <div className="flex flex-wrap">
              <div className="w-full px-4 mb-10 lg:w-1/2">
                <h4 className="font-bold uppercase text-primary text-lg">
                  About Me
                </h4>
                <h2 className="font-bold text-dark text-3xl mb-5 max-w-xl lg:text-4xl">
                  let me introduce myself
                </h2>
                <p className="font-medium text-base text-secondary max-w-xl lg:text-lg">
                  Greetings, I'm Kenan Tomfie Bukit. Currently, I am a student
                  at one of the institutes located around Lake Toba.
                </p>
              </div>
              <div className="w-full px-4 lg:w-1/2">
                <h3 className="font-semibold text-dark text-2xl mb-4 lg:text-3xl lg:pt-10">
                  Mari berteman
                </h3>
                <p className="font-medium text-base text-secondary mb-6 lg:text-lg ">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptates libero aspernatur ab neque tempore quia soluta
                  repellat at?
                </p>
                <div className="text-5xl flex justify-center md:justify-start gap-16 text-gray-600 dark:text-gray-400">
                  <Link
                    href="https://www.instagram.com/kenan_bukit/"
                    target="_blank"
                  >
                    <AiFillInstagram />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/kenan-tomfie0604"
                    target="_blank"
                  >
                    <AiFillLinkedin />
                  </Link>
                  <Link
                    href="https://youtube.com/@kenantomfiebukit989"
                    target="_blank"
                  >
                    <AiFillYoutube />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div>
            <h3 className="text-3xl py-1 dark:text-white ">Services I offer</h3>
            <p className="text-md py-2 leading-8 text-gray-800 dark:text-gray-200">
              Since the beginning of my journey as a freelance designer and
              developer, I`ve done remote work for
              <span className="text-teal-500"> agencies </span>
              consulted for <span className="text-teal-500">startups </span>
              and collaborated with talanted people to create digital products
              for both business and consumer use.
            </p>
            <p className="text-md py-2 leading-8 text-gray-800 dark:text-gray-200">
              I offer from a wide range of services, including brand design,
              programming and teaching.
            </p>
          </div>
          <div className="lg:flex gap-10">
            <div className="text-center shadow-lg p-10 rounded-xl my-10  dark:bg-white flex-1">
              <Image alt="" src={design} width={100} height={100} />
              <h3 className="text-lg font-medium pt-8 pb-2  ">
                Beautiful Designs
              </h3>
              <p className="py-2">
                Creating elegant designs suited for your needs following core
                design theory.
              </p>
              <h4 className="py-4 text-teal-600">Design Tools I Use</h4>
              <p className="text-gray-800 py-1">Photoshop</p>
              <p className="text-gray-800 py-1">Illustrator</p>
              <p className="text-gray-800 py-1">Figma</p>
              <p className="text-gray-800 py-1">Indesign</p>
            </div>
            <div className="text-center shadow-lg p-10 rounded-xl my-10 dark:bg-white flex-1">
              <Image alt="" src={code} width={100} height={100} />
              <h3 className="text-lg font-medium pt-8 pb-2 ">
                Code your dream project
              </h3>
              <p className="py-2">
                Do you have an idea for your next great website? Let`s make it a
                reality.
              </p>
              <h4 className="py-4 text-teal-600">Design Tools I Use</h4>
              <p className="text-gray-800 py-1">Photoshop</p>
              <p className="text-gray-800 py-1">Illustrator</p>
              <p className="text-gray-800 py-1">Figma</p>
              <p className="text-gray-800 py-1">Indesign</p>
            </div>
            <div className="text-center shadow-lg p-10 rounded-xl my-10 dark:bg-white flex-1">
              <Image alt="" src={consulting} width={100} height={100} />
              <h3 className="text-lg font-medium pt-8 pb-2 ">Consulting</h3>
              <p className="py-2">
                Are you interested in feedback for your current project? I can
                give you tips and tricks to level it up.
              </p>
              <h4 className="py-4 text-teal-600">Design Tools I Use</h4>
              <p className="text-gray-800 py-1">Photoshop</p>
              <p className="text-gray-800 py-1">Illustrator</p>
              <p className="text-gray-800 py-1">Figma</p>
              <p className="text-gray-800 py-1">Indesign</p>
            </div>
          </div>
        </section>
        <section className="py-10">
          <div>
            <h3 className="text-3xl py-1 dark:text-white ">Portofolio</h3>
            <p className="text-md py-2 leading-8 text-gray-800 dark:text-gray-200">
              Since the beginning of my journey as a freelance designer and
              developer, I`ve done remote work for
              <span className="text-teal-500"> agencies </span>
              consulted for <span className="text-teal-500">startups </span>
              and collaborated with talanted people to create digital products
              for both business and consumer use.
            </p>
            <p className="text-md py-2 leading-8 text-gray-800 dark:text-gray-200">
              I offer from a wide range of services, including brand design,
              programming and teaching.
            </p>
          </div>
          <div className="flex flex-col gap-10 py-10 lg:flex-row lg:flex-wrap">
            <div className="basis-1/3 flex-1 ">
              <Image
                className="rounded-lg object-cover"
                alt=""
                layout="responsive"
                src={web1}
              />
            </div>
            <div className="basis-1/3 flex-1">
              <Image
                className="rounded-lg object-cover"
                alt=""
                layout="responsive"
                src={web2}
              />
            </div>
            <div className="basis-1/3 flex-1">
              <Image
                className="rounded-lg object-cover"
                alt=""
                layout="responsive"
                src={web3}
              />
            </div>
            <div className="basis-1/3 flex-1">
              <Image
                className="rounded-lg object-cover"
                alt=""
                layout="responsive"
                src={web4}
              />
            </div>
            <div className="basis-1/3 flex-1">
              <Image
                className="rounded-lg object-cover"
                alt=""
                layout="responsive"
                src={web5}
              />
            </div>
            <div className="basis-1/3 flex-1">
              <Image
                className="rounded-lg object-cover"
                alt=""
                layout="responsive"
                src={web6}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
