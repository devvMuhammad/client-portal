import Link from "next/link";
import ProfileCSR from "./profile-csr";
import ProfileSSR from "./profile-ssr";

export default async function ServiceNavbar({ ssr }: { ssr: boolean }) {
  return (
    <nav className="p-4 flex w-full items-center justify-between">
      <Link href="/" className="text-2xl font-bold text-alphaDark">
        FlexiBlog
      </Link>
      <div className="flex gap-1 sm:gap-6 md:gap-32">
        <div className="flex gap-6 items-center text-alpha font-bold">
          <Link className="hover:text-alphaDarker" href="/">
            Home
          </Link>
          <Link className="hover:text-alphaDarker" href="/services">
            Services
          </Link>
          <Link className="hover:text-alphaDarker" href="/">
            Blogs
          </Link>
        </div>
        {ssr ? <ProfileSSR /> : <ProfileCSR />}
      </div>
    </nav>
  );
}
