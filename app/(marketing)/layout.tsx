import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "radial-gradient(ellipse at 60% 10%, #7AB2B2 0%, #aed6da 22%, #c8e8ed 45%, #d9eff3 65%, #EBF4F6 100%)" }}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
