import Image from "@/common/components/elements/Image";
import { useTranslations } from "next-intl";

interface StoryProps {
  aboutMe: string;
}

const Story = ({ aboutMe }: StoryProps) => {
  // Defensive check: if aboutMe is an object (failed localization), try to get en
  const content = typeof aboutMe === "string" 
    ? aboutMe 
    : (typeof aboutMe === "object" && aboutMe !== null 
        ? ((aboutMe as any)["en"] || JSON.stringify(aboutMe)) 
        : "");

  const paragraphs = content.split("\n\n").filter((p: string) => p.trim() !== "");

  if (paragraphs.length === 0) {
    return (
      <section className="text-neutral-500 italic pb-4 border-b border-neutral-200 dark:border-neutral-800">
        {aboutMe ? "Loading bio..." : "No bio content available."}
      </section>
    );
  }

  return (
    <section className="space-y-4 leading-7 text-neutral-800 dark:text-neutral-300">
      {paragraphs.map((paragraph: string, index: number) => (
        <div key={index}>
          {paragraph}
        </div>
      ))}
      <Image
        src="/images/signature.png"
        alt="signature"
        width={100}
        height={100}
        className="mt-4"
      />
    </section>
  );
};

export default Story;
