export default function ProductsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex-1 w-full mt-30">{children}</div>;
}
