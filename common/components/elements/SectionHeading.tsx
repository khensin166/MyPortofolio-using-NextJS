interface SectionHeadingProps {
  title: string;
  icon?: React.ReactNode;
  className?: string;
}

const SectionHeading = ({
  title,
  icon,
  className = "",
}: SectionHeadingProps) => {
  return (
    <div
      className={`flex items-center gap-1.5 text-xl font-medium text-foreground ${className}`}
    >
      {icon ? <i>{icon}</i> : null}
      <h2 className="capitalize">{title}</h2>
    </div>
  );
};

export default SectionHeading;
