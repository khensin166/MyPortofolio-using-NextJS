import React, { useState, useEffect } from "react";
import styles from "./Hero.module.css";
import { getImageUrl } from "../../utils";
import { FaInstagram, FaLinkedin, FaGithub, FaYoutube } from "react-icons/fa";

export const Hero = () => {
  const words = [
    "Backend Development",
    "Web Development",
    "Mobile Android",
    "iOS Development",
    "Cloud Integration",
  ];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Logika animasi Anda tetap sama
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 600); // Sesuaikan dengan durasi animasi di CSS
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    // .container sekarang menjadi wrapper utama untuk konten dan gambar
    <section className={styles.container}>
      {/* .content berisi semua elemen teks dan tombol */}
      <div className={styles.content}>
        <h1 className={styles.title}>Hi👋, I'm Kenan</h1>
        <p className={styles.description}>
          I'm a software engineer with experience in full-stack development, specializing in{" "}
          <span className={styles.animatedWordContainer}>
            <span
              className={`${styles.animatedWord} ${
                isAnimating ? styles.flipOut : styles.flipIn
              }`}
            >
              {words[currentWordIndex]}
            </span>
          </span>
           Passionate about creating innovative solutions and solving complex problems. Reach out if you'd like to learn more!
        </p>

        {/* Wadah baru untuk tombol dan ikon sosial */}
        <div className={styles.actionsContainer}>
          <a
            href="https://drive.google.com/file/d/1lde0FbGG5dL8gQpGCAcR8Y0WlVbslGo3/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactBtn}
          >
            Resume
          </a>
          <div className={styles.socialMedia}>
            <a
              href="https://www.instagram.com/kenan_bukit?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialBtn}
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/in/kenan-tomfie-bukit"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialBtn}
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com/khensin166"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialBtn}
            >
              <FaGithub />
            </a>
            <a
              href="https://www.youtube.com/" // Ganti dengan URL YouTube Anda
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialBtn}
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      <img
        src={getImageUrl("hero/heroImagee.png")}
        alt="Profile picture of Kenan"
        className={styles.heroImg}
      />
      
      <div className={styles.topBlur} />
      <div className={styles.bottomBlur} />
    </section>
  );
};