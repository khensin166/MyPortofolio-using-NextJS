import { TbMoodSadSquint as MoodIcon } from "react-icons/tb";

interface EmptyStateProps {
  message: string;
}

const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-3 py-5 text-muted-foreground">
      <MoodIcon size={48} />
      <p>{message}</p>
    </div>
  );
};

export default EmptyState;
