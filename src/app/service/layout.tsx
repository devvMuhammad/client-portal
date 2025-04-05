import Footer from "@/components/flexiblog/Footer";
import Gap from "@/components/flexiblog/Gap";
import ServiceNavbar from "@/components/service-navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      {/* @Navbar */}
      <ServiceNavbar ssr={false} />
      {/* @Children */}
      <div className="max-w-screen bg-flexiBackground min-h-screen">
        {children}
      </div>
      {/* @Footer */}
      <Footer />
      <Gap />
    </main>
  );
}
