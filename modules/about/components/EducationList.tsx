import { TbSchool as EducationIcon } from "react-icons/tb";

import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";
import { EducationProps } from "@/common/types/education";
import EducationCard from "./EducationCard";
import { useTranslations } from "next-intl";

interface EducationListProps {
  education: any[];
}

const EducationList = ({ education }: EducationListProps) => {
  const t = useTranslations("AboutPage.education");

  const mappedEducation: EducationProps[] =
    education?.map((item) => ({
      school: item.institutionName,
      major: item.major,
      logo: item.imageLogo,
      location: item.location || "Indonesia",
      degree: item.degree,
      GPA: item.gpa,
      start_year: item.displayStartDate || new Date(item.startDate).getFullYear(),
      end_year: item.displayEndDate || new Date(item.endDate).getFullYear(),
      description: item.description,
      link: item.link || "#",
    })) || [];

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <SectionHeading title={t("title")} icon={<EducationIcon />} />
        <SectionSubHeading>
          <p>{t("sub_title")}</p>
        </SectionSubHeading>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mappedEducation.map((item, index) => (
          <EducationCard key={index} {...item} />
        ))}
      </div>
    </section>
  );
};

export default EducationList;
