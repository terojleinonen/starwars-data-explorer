export default function ContentContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="content-container">{children}</div>;
}