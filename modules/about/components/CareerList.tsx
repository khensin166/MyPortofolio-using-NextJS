"use client";

import { useTranslations } from "next-intl";
import { HiOutlineBriefcase as CareerIcon } from "react-icons/hi";

import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";
import { CareerProps } from "@/common/types/careers";
import CareerCard from "./CareerCard";

interface CareerListProps {
  experiences: any[];
}

const CareerList = ({ experiences }: CareerListProps) => {
  const t = useTranslations("AboutPage.career");

  const mappedCareers: CareerProps[] =
    experiences?.map((item) => ({
      position: item.role,
      company: item.organisation,
      logo: item.imageSrc,
      location: item.location,
      start_date: item.startDate,
      end_date: item.endDate,
      location_type: item.workSetting,
      type: item.employmentType,
      responsibilities: item.responsibilities,
      lessons_learned: item.whatILearned,
      impact: item.impact,
      link: item.link || null,
      industry: item.industry || "",
      isShow: true,
    })) || [];

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <SectionHeading title={t("title")} icon={<CareerIcon />} />
        <SectionSubHeading>
          <p>{t("sub_title")}</p>
        </SectionSubHeading>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mappedCareers.map((career, index) => (
          <CareerCard key={index} indexCareer={index} {...career} />
        ))}
      </div>
    </section>
  );
};

export default CareerList;
