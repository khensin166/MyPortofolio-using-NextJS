import Breakline from "@/common/components/elements/Breakline";

import Introduction from "./Introduction";
import SkillList, { SkillItem } from "./SkillList";

interface HomeProps {
  skills: SkillItem[];
  resumeUrl?: string;
  heroDescription?: string;
  location?: string;
}

const Home = ({ skills, resumeUrl, heroDescription, location }: HomeProps) => {
  return (
    <>
      <Introduction
        resumeUrl={resumeUrl}
        heroDescription={heroDescription}
        location={location}
      />
      <Breakline className="my-8" />
      <SkillList skills={skills} />
    </>
  );
};

export default Home;
