import { FileIcon } from "lucide-react";
import BigBlogCard from "./BigBlogCard";
import Gap from "./Gap";
import CustomCard from "../ui/custom-card";
import Link from "next/link";

// Define the number of blog cards to display
const TOTAL_BIG_BLOGS = 2;
const TOTAL_SMALL_BLOGS = 3;

// Function to generate dummy blog data
const generateDummyBlog = (index: any, isSmall = false) => ({
  _id: `dummy-${index}`,
  title: isSmall ? "Dummy Small Blog Title" : "Dummy Big Blog Title",
  category: { title: "Dummy Category", slug: { current: "dummy-category" } },
  description: "This is a placeholder for future blog content.",
  titleImage: null,
  author: { name: "Anonymous" },
  _createdAt: "2024-07-26T10:59:44Z",
});

export default function BlogListWithMiddle({
  blogsGroup,
}: {
  blogsGroup: { category: any; blogs: any[] };
}) {
  // Fill in missing slots with dummy data
  const filledBlogs = [
    ...blogsGroup.blogs,
    ...Array(
      Math.max(0, TOTAL_BIG_BLOGS + TOTAL_SMALL_BLOGS - blogsGroup.blogs.length)
    )
      .fill(null)
      .map((_, index) => generateDummyBlog(index + blogsGroup.blogs.length)),
  ];

  const bigBlogs = filledBlogs.slice(0, TOTAL_BIG_BLOGS);
  const smallBlogs = filledBlogs.slice(
    TOTAL_BIG_BLOGS,
    TOTAL_BIG_BLOGS + TOTAL_SMALL_BLOGS
  );

  return (
    <section className="section-container ">
      <div className="w-full flex justify-between">
        <p className="text-center md:text-left pl-8 text-2xl font-bold text-black border-l-8 border-l-omegaLight">
          {blogsGroup.category.title}
        </p>
        <Link
          href={`/category/${blogsGroup.category.slug.current}`}
          className="hidden md:inline small-button"
        >
          View More
        </Link>
      </div>
      <Gap />
      {/* @Big Blog Cards*/}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BigBlogCard blog={bigBlogs[0]} smallButton={false} />
        <MiddleThreeBlogs blogs={smallBlogs} />
        <BigBlogCard blog={bigBlogs[1]} smallButton={false} />
      </div>
    </section>
  );
}

function MiddleThreeBlogs({ blogs }: { blogs: any[] }) {
  return (
    <div className="grid grid-rows-3 gap-4">
      {blogs.map((blog, index) => (
        <MiddleSmallBlog key={blog._id} blog={blog} />
      ))}
    </div>
  );
}

export function MiddleSmallBlog({ blog }: { blog: any }) {
  return (
    <CustomCard
      override={true}
      className="relative grid grid-cols-[3fr_7fr] md:grid-cols-[1px_auto_1fr] gap-3 bg-white rounded-xl pt-2 pr-2 pb-2"
    >
      <div className="hidden md:block h-full w-1 overflow-hidden rounded-xl bg-alphaLight"></div>
      {/* @Green Image */}
      <div className="ml-2 text-sm bg-green-200 h-full w-full md:w-[115px] rounded-md flex flex-col items-center justify-center text-center">
        <FileIcon />
        {blog.category.title}
      </div>
      {/* @Case Study Text */}
      <div className="p-2 grid grid-rows-[1fr_auto_auto]">
        <h2 className="font-semibold leading-tight mb-4">{blog.title}</h2>
        <span className="text-xs font-bold text-omegaDark mb-1">
          {blog.author.name}
        </span>
        <span className="text-xs text-omegaDark">
          {blog.publishedAt
            ? new Date(blog._createdAt).toLocaleDateString()
            : "No date"}{" "}
          · {blog.readingTime || "2"} min
        </span>
      </div>
    </CustomCard>
  );
}
