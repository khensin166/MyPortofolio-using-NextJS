import Breakline from "@/common/components/elements/Breakline";

import Introduction from "./Introduction";
import SkillList, { SkillItem } from "./SkillList";
import VisitorAnalytics from "./VisitorAnalytics";

interface HomeProps {
  skills: SkillItem[];
  analytics?: any;
  resumeUrl?: string;
  heroDescription?: string;
  location?: string;
}

const Home = ({ skills, analytics, resumeUrl, heroDescription, location }: HomeProps) => {
  return (
    <>
      <Introduction
        resumeUrl={resumeUrl}
        heroDescription={heroDescription}
        location={location}
      />
      <Breakline className="my-8" />
      <SkillList skills={skills} />
      <Breakline className="my-8" />
      <VisitorAnalytics data={analytics} />
    </>
  );
};

export default Home;
