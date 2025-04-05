import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import CustomCard from "../ui/custom-card";
import { formatDate } from "@/lib/utils";

export default async function RelatedBlogs() {
  //! write the query here later to fetch related blogs
  const query = groq`*[_type == "blog"][0...2]{_id,slug,title,author->{name},_createdAt}`;
  const data = await client.fetch(query);

  // return <pre>{JSON.stringify(data, null, 2)}</pre>;

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {data.map((blog: any) => (
        <RelatedPost
          key={blog._id}
          title={blog.title}
          authorName={blog.author.name}
          createdAt={blog._createdAt}
        />
      ))}
    </div>
  );
}

function RelatedPost({
  title,
  authorName,
  createdAt,
}: {
  title: string;
  authorName: string;
  createdAt: string;
}) {
  return (
    <CustomCard className="w-full relative grid grid-cols-[1px_1fr] gap-3 bg-white rounded-xl pl-0 pt-2 pr-2 pb-2">
      <div className="hidden md:block h-full w-1 overflow-hidden rounded-xl bg-alphaLight"></div>
      {/* @Case Study Text */}
      <div className="p-2 flex flex-col text-left">
        <h2 className="font-semibold leading-tight mb-4">{title}</h2>
        <span className="text-xs font-bold text-omegaDark mb-1">
          {authorName}
        </span>
        <span className="text-xs text-omega">
          {formatDate(createdAt)} · 1 min
        </span>
      </div>
    </CustomCard>
  );
}
