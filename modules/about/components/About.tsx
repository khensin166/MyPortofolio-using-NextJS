import Breakline from "@/common/components/elements/Breakline";

import Story from "./Story";
import CareerList from "./CareerList";
import EducationList from "./EducationList";

interface AboutProps {
  experiences: any[];
  education: any[];
  aboutMe: string;
}

const About = ({ experiences, education, aboutMe }: AboutProps) => {
  return (
    <>
      <Story aboutMe={aboutMe} />
      <Breakline className="my-8" />
      <CareerList experiences={experiences} />
      <Breakline className="my-8" />
      <EducationList education={education} />
    </>
  );
};

export default About;
