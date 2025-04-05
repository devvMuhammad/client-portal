import { Avatar } from "@radix-ui/react-avatar";
import Image from "next/image";
import { AvatarImage } from "../ui/avatar";
import CustomCard from "../ui/custom-card";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

export default function BigBlogCard({
  blog,
  smallButton = true,
}: {
  blog: any;
  smallButton?: boolean;
}) {
  console.log(blog);
  return (
    <CustomCard
      override={true}
      className="bg-white rounded-2xl card-hover pt-2 pl-2 pr-2 pb-8 flex flex-col hover:-translate-y-2 cursor-pointer"
    >
      {/* @Blog Image */}
      {blog.titleImage ? (
        <Image
          src={urlFor(blog.titleImage).height(400).width(400).url() as string}
          alt={blog.titleImage?.alt || ""}
          width={400}
          height={400}
          className="w-full h-48 object-cover border-b rounded-t-2xl"
          sizes="100vw"
        />
      ) : (
        <div className="h-48 rounded-t-xl bg-cyan-200 "></div>
      )}
      {/* @Advertising */}
      {smallButton && (
        <div className="ml-4 mb-4 mt-4">
          <Link
            href={`/category/${blog?.category?.slug?.current || "uncategorized"}`}
            className="category-blog-button"
          >
            {blog.category?.title || "Uncategorized"}
          </Link>
        </div>
      )}
      {/* @Text Part */}
      <div
        className={`flex-1 grid grid-rows-[auto_1fr_auto] ${!smallButton && "mt-4"}`}
      >
        {/* @Title */}
        <Link
          href={`/blog/${blog.slug?.current || "#"}`}
          className="ml-4 mb-4 text-black font-bold text-lg truncate-lines-3"
        >
          {blog.title}
        </Link>
        {/* @Description */}
        <p className="ml-4 mb-4 truncate-lines text-sm leading-loose text-text">
          {blog.description}
        </p>
        {/* @Author Details */}
        <div className="ml-4 flex gap-4">
          <Avatar>
            <AvatarImage
              width={50}
              height={50}
              src={
                blog.author?.image
                  ? urlFor(blog.author.image).width(50).height(50).url()
                  : "/images/author.webp"
              }
              alt={blog.author?.name || "user"}
              className="rounded-full bg-gray-300"
            />
          </Avatar>
          <div className="flex flex-col">
            <p className="font-bold ">{blog.author?.name || "Anonymous"}</p>
            <p className="text-xs text-gray-500">
              {blog._createdAt
                ? new Date(blog._createdAt).toLocaleDateString()
                : "No date"}
            </p>
          </div>
        </div>
      </div>
    </CustomCard>
  );
}
