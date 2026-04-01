interface PageHeadingProps {
  title?: string;
  description?: string | string[];
}

const PageHeading = ({ title, description }: PageHeadingProps) => {
  return (
    <div className="mb-6 border-b border-dashed border-border pb-6">
      <h1 className="text-2xl font-medium">{title}</h1>
      <div className="mt-2 space-y-4 text-muted-foreground leading-relaxed">
        {Array.isArray(description) ? (
          description.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))
        ) : (
          <p>{description}</p>
        )}
      </div>
    </div>
  );
};

export default PageHeading;
