interface PageHeadingProps {
  title?: string;
  description?: string;
}

const PageHeading = ({ title, description }: PageHeadingProps) => {
  return (
    <>
      <h1 className="text-2xl font-medium">{title}</h1>
      <p className="mb-6 border-b border-dashed border-border pb-6 pt-2 text-muted-foreground">
        {description}
      </p>
    </>
  );
};

export default PageHeading;
