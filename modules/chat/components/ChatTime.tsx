import { useEffect, useState } from "react";
import { format, formatDistanceToNow, isToday } from "date-fns";

interface ChatTimeProps {
  datetime: string;
}

const ChatTime = ({ datetime }: ChatTimeProps) => {
  const date = new Date(datetime);
  const isValidDate = !isNaN(date.getTime());

  const [formattedTime, setFormattedTime] = useState(
    isValidDate ? formatDistanceToNow(date, { addSuffix: true }) : "Invalid Date",
  );

  useEffect(() => {
    if (!isValidDate) return;
    const interval = setInterval(() => {
      setFormattedTime(formatDistanceToNow(new Date(datetime), { addSuffix: true }));
    }, 60000);

    return () => clearInterval(interval);
  }, [datetime, isValidDate]);

  if (!isValidDate) return <div className="text-xs text-neutral-500">Invalid Date</div>;

  return (
    <div className="text-xs font-medium tracking-wide text-neutral-500">
      {isToday(date) ? formattedTime : format(date, "dd/MM/yyyy, HH:mm")}
    </div>
  );
};

export default ChatTime;
