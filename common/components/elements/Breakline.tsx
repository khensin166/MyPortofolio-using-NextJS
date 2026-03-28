import clsx from "clsx";

interface BreaklineProps {
  className?: string;
  [propName: string]: string | undefined;
}

const Breakline = ({ className = "", ...others }: BreaklineProps) => {
  return (
    <div
      className={clsx(
        "my-4 border-t border-border",
        className,
      )}
      {...others}
    ></div>
  );
};

export default Breakline;
