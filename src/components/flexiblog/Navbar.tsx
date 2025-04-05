import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";

const mainMenuLinks = ["Home", "Services", "Blogs"] as const;
// const categories = ["Advertising", "Case Studies", "Innovation", "Management"];

export default async function Navbar({ className }: { className?: string }) {
  const blogCategoriesQuery = groq`*[_type == "category"]{title,slug}`;
  const categories = await client.fetch(blogCategoriesQuery);

  return (
    <nav
      className={cn(
        "section-container bg-headerBg h-[140px] flex items-center justify-between",
        className
      )}
    >
      {/* @Logo */}
      <Link
        className="text-text font-bold text-xl hover:text-alpha transition-all duration-300 ease"
        href="/"
      >
        FlexiBlog
      </Link>
      {/*  */}
      {/* @Hamburger Later */}
      <HamburgerSheet />
      {/* */}
      <div className="hidden md:flex gap-1 sm:gap-6 md:gap-32">
        {/* @Links */}
        <div className="flex gap-6 items-center text-text font-bold">
          {mainMenuLinks.map((menu, index) => {
            if (menu === "Blogs") {
              return (
                <DropdownMenu key={menu}>
                  <DropdownMenuTrigger asChild>
                    <span className="cursor-pointer text-text text-lg hover:text-alpha transition-all duration-300 ease">
                      Blogs
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-52">
                    <DropdownMenuLabel className="font-bold text-lg hover:text-alpha transition-all duration-300 ease">
                      Categories
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {categories.map((category: any, index: any) => (
                      <DropdownMenuItem key={index}>
                        <Link
                          className="text-text text-base hover:text-alpha transition-all duration-300 ease"
                          href={`/category/${category.slug.current}`}
                        >
                          {category.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <Link
                key={index}
                className="text-text text-lg hover:text-alpha transition-all duration-300 ease"
                href="/services"
              >
                {menu}
              </Link>
            );
          })}
        </div>
        {/* @Switch for dark and light */}
        <Switch />
      </div>
    </nav>
  );
}

function HamburgerSheet() {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden " asChild>
        <div className="p-2 bg-omegaLighter rounded-full group hover:bg-alpha cursor-pointer">
          <MenuIcon
            className="text-omega group-hover:text-white"
            strokeWidth={3.5}
          />
        </div>
      </SheetTrigger>
      <SheetContent className="pt-14 pl-10 w-full sm:w-[540px]">
        {/* @Main Menu */}
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-xl">Main Menu</h2>

          {mainMenuLinks.map((link, index) => (
            <Link
              key={index}
              className="text-text text-lg hover:text-alpha transition-all duration-300 ease"
              href="/services"
            >
              {link}
            </Link>
          ))}
        </div>
        <Separator className="my-10" />
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-xl">Topics</h2>
          {/* {categories.map((category, index) => (
            <Link
              key={index}
              className="text-text text-lg hover:text-alpha transition-all duration-300 ease"
              href="/category/test-category-slug"
            >
              {category}
            </Link>
          ))} */}
        </div>
      </SheetContent>
    </Sheet>
  );
}
