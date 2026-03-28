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
      <section className="text-muted-foreground italic pb-4 border-b border-border">
        {aboutMe ? "Loading bio..." : "No bio content available."}
      </section>
    );
  }

  return (
    <section className="space-y-4 leading-7 text-foreground">
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
