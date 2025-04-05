import Image from "next/image";
import { Avatar, AvatarImage } from "../ui/avatar";
import Gap from "./Gap";
import BigBlogCard from "./BigBlogCard";
import CustomCard from "../ui/custom-card";
import Link from "next/link";

// Define the number of blog cards to display
const TOTAL_BLOG_CARDS = 3;

// Function to generate dummy blog data
const generateDummyBlog = (index: any) => ({
  _id: `dummy-${index}`,
  title: "Dummy Blog Title",
  category: { title: "Dummy Category" },
  description: "This is a placeholder for future blog content.",
  titleImage: null,
});

export default function BlogList({
  blogsGroup,
}: {
  blogsGroup: { category: { title: string }; blogs: any[] };
}) {
  // Fill in missing slots with dummy data
  const filledBlogs = [
    ...blogsGroup.blogs,
    ...Array(Math.max(0, TOTAL_BLOG_CARDS - blogsGroup.blogs.length))
      .fill(null)
      .map((_, index) => generateDummyBlog(index + blogsGroup.blogs.length)),
  ];

  return (
    <section className="section-container ">
      <div className="w-full flex justify-between">
        <p className="text-center md:text-left pl-8 text-2xl font-bold text-black border-l-8 border-l-omegaLight">
          {blogsGroup.category.title}
        </p>
        <Link href="/category/test" className="hidden md:inline small-button">
          View More
        </Link>
      </div>
      <Gap />
      {/* @Big Blog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filledBlogs.slice(0, TOTAL_BLOG_CARDS).map((blog) => (
          <BigBlogCard key={blog._id} blog={blog} />
        ))}
      </div>
      {/* @Small Blog Cards */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {filledBlogs.slice(0, TOTAL_BLOG_CARDS).map((blog) => (
          <SmallBlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </section>
  );
}

export function SmallBlogCard({ blog }: { blog: any }) {
  return (
    <CustomCard
      override
      hoverTransition
      className="relative flex bg-white rounded-xl gap-2"
    >
      <div className="hidden md:block h-full w-1 overflow-hidden rounded-xl bg-alphaLight"></div>
      <div className="flex-1 flex flex-col gap-3 p-4 ">
        <div>
          <button className="category-blog-button">
            {blog.category.title}
          </button>
        </div>
        <p className="flex-1 font-semibold">
          {/* Getting to Grips with Digital Advertising Best Practice Guide */}
          {blog.title}
        </p>
        {/* @Small Author Details */}
        <div className="flex justify-between text-text">
          <span className="font-bold text-xs">John Doe</span>
          <div className="flex gap-2 text-xs">
            <span>April 16, 2020 · 1 min</span>
          </div>
        </div>
      </div>
    </CustomCard>
  );
}
