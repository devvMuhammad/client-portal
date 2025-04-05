import Link from "next/link";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import ContactPopup from "../contact-popup";

export default function StickyNavbar() {
  return (
    <nav className="relative z-20 w-full bg-transparent">
      <div className="section-container h-[140px] flex items-center justify-between">
        {/* @Logo */}
        <Link href="/" className="text-xl font-bold text-white">
          FlexiBlog
        </Link>
        {/*  */}
        {/* @Hamburger Later */}
        <div className="flex gap-1 sm:gap-6 md:gap-32">
          {/* @Links */}
          <div className="flex gap-6 items-center text-white font-bold">
            <Link className="hover:text-alpha" href="#">
              Home
            </Link>
            <Link className="hover:text-alpha" href="#">
              Our Team
            </Link>
            <Link className="hover:text-alpha" href="#">
              Contact
            </Link>
          </div>
          {/* @Switch for dark and light */}
          <ContactPopup />
        </div>
      </div>
    </nav>
  );
}
