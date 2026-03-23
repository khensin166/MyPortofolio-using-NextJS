import styles from "./page.module.css";
import { Navbar } from "../components/Navbar/Navbar";
import { Hero } from "../components/Hero/Hero";
import { About } from "../components/About/About";
import { Projects } from "../components/Projects/Projects";
import { Experience } from "../components/Experience/Experience";
import { Contact } from "../components/Contact/Contact";

export default async function Home() {
  let projectsData = [];
  let skillsData = [];
  let experienceData = [];

  try {
    const bypass = Date.now();
    // Menarik Data secara paralel dari Edge Hono API Anda!
    const [resProj, resSkill, resExp] = await Promise.all([
      fetch(`https://my-portofolio-backend.vercel.app/api/projects?t=${bypass}`, {
        next: { tags: ['projects'], revalidate: 3600 }
      }),
      fetch(`https://my-portofolio-backend.vercel.app/api/skills?t=${bypass}`, {
        next: { tags: ['skills'], revalidate: 3600 }
      }),
      fetch(`https://my-portofolio-backend.vercel.app/api/experiences?t=${bypass}`, {
        next: { tags: ['experiences'], revalidate: 3600 }
      }),
    ]);

    const projJson = await resProj.json();
    const skillJson = await resSkill.json();
    const expJson = await resExp.json();

    projectsData = projJson.data || projJson || [];
    skillsData = skillJson.data || skillJson || [];
    experienceData = expJson.data || expJson || [];

  } catch (err) {
    console.error("Gagal menarik data dari Hono:", err);
  }

  return (
    <div className={styles.App}>
      <Navbar />
      <Hero />
      <About />
      <Experience skills={skillsData} history={experienceData} />
      <Projects projects={projectsData} />
      <Contact />
    </div>
  );
}
