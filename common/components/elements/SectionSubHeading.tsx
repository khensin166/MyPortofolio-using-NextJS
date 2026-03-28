interface SectionSubHeadingProps {
  children: React.ReactNode;
}

const SectionSubHeading = ({ children }: SectionSubHeadingProps) => {
  return (
    <div className="flex flex-col justify-between gap-2 text-muted-foreground md:flex-row lg:items-center">
      {children}
    </div>
  );
};

export default SectionSubHeading;
