interface SkillCardProps {
  name: string;
  icon: JSX.Element;
  color: string;
}

const SkillCard = ({ name, icon, color }: SkillCardProps) => {
  return (
    <div className="px-2">
      <div className="flex w-full space-x-2 rounded-full border border-border bg-card px-4 py-2 shadow-sm">
        <div className={`h-6 w-6 ${color}`}>{icon}</div>
        <div className="whitespace-nowrap">{name}</div>
      </div>
    </div>
  );
};

export default SkillCard;
