import Footer from "@/components/flexiblog/Footer";
import Gap from "@/components/flexiblog/Gap";
import Navbar from "@/components/flexiblog/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      {/* @Navbar */}
      <Navbar />
      {/* @Children */}
      <div className="max-w-screen bg-flexiBackground min-h-screen py-10 md:py-20">
        {children}
      </div>
      {/* @Footer */}
      <Footer />
      <Gap />
    </main>
  );
}
