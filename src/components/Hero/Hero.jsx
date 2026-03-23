import React from "react";
import styles from "./Hero.module.css";
import Image from "next/image";
import { getImageUrl } from "../../utils";
import { FaInstagram, FaLinkedin, FaGithub, FaYoutube } from "react-icons/fa";

export const Hero = ({ profile }) => {
  // Gunakan data dari Database, fallback ke default jika kosong
  const description = profile?.heroDescription || "I'm a software engineer passionate about creating innovative solutions.";
  const resumeUrl = profile?.resumeUrl || "#";

  return (
    // .container sekarang menjadi wrapper utama untuk konten dan gambar
    <section className={styles.container}>
      {/* .content berisi semua elemen teks dan tombol */}
      <div className={styles.content}>
        <h1 className={styles.title}>Hi👋, I'm Kenan</h1>
        <p className={styles.description}>
          {description}
        </p>

        {/* Wadah baru untuk tombol dan ikon sosial */}
        <div className={styles.actionsContainer}>
          <a
            href={resumeUrl}
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

      <Image
        src={getImageUrl("hero/heroImagee.png")}
        alt="Profile picture of Kenan"
        width={400}
        height={400}
        priority={true}
        className={styles.heroImg}
      />
      
      <div className={styles.topBlur} />
      <div className={styles.bottomBlur} />
    </section>
  );
};