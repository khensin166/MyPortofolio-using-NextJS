import React from "react";
import styles from "./Hero.module.css";
import { getImageUrl } from "../../utils";
import { FaInstagram, FaLinkedin, FaGithub, FaYoutube } from "react-icons/fa";

export const Hero = () => {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Hi👋, I'm Kenan</h1>
        <p className={styles.description}>
          I'm an Information Technology student with a strong interest in full-stack engineering, proficient in both mobile and web development. Reach out if you'd like to learn more!
        </p>
        <a href="https://drive.google.com/file/d/1E0Rito2XsA-yv2n2ekkDV7cOM_umGfa1/view?usp=sharing" target="_blank" className={styles.contactBtn}>
          Resume
        </a>
        <div className={styles.socialMedia}>
          <a href="https://www.instagram.com/kenan_bukit/" target="_blank" className={styles.socialBtn}><FaInstagram /></a>
          <a href="https://www.linkedin.com/in/kenan-tomfie-bukit" target="_blank" className={styles.socialBtn}><FaLinkedin /></a>
          <a href="https://github.com/khensin166" target="_blank" className={styles.socialBtn}><FaGithub /></a>
          <a href="https://www.youtube.com/@kenantomfiebukit989" target="_blank" className={styles.socialBtn}><FaYoutube /></a>
        </div>
      </div>
      <img
        src={getImageUrl("hero/heroImagee.png")}
        alt="Hero image of me"
        className={styles.heroImg}
      />
      <div className={styles.topBlur} />
      <div className={styles.bottomBlur} />
    </section>
  );
};
