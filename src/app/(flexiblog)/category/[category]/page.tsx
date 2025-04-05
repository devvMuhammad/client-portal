import BigBlogCard from "@/components/flexiblog/BigBlogCard";
import Gap from "@/components/flexiblog/Gap";
import { REVALIDATE_TIME_PERIOD } from "@/config/data";
import { client } from "@/sanity/lib/client";
import { MoveLeft, MoveRight } from "lucide-react";
import { Metadata } from "next";
import { groq } from "next-sanity";

export const revalidate = REVALIDATE_TIME_PERIOD;

export const metadata: Metadata = {
  title: "Blogs by Category",
};

export async function generateStaticParams() {
  const categories = groq`*[_type == "category"]{slug}`;
  const data = (await client.fetch(categories)) as {
    slug: { current: string };
  }[];
  return data.map((category) => ({
    params: { category: category.slug.current },
  }));
}

export default async function CategoryBlogs({
  params: { category },
}: {
  params: { category: string };
}) {
  const blogsByCategory = groq`*[_type == "blog" && category->slug.current == $slug]{title,description,slug,category->{title,slug},author->{name,image,headline},titleImage,_createdAt}`;
  const data = await client.fetch(blogsByCategory, { slug: category });

  if (data.length === 0) {
    return (
      <section className="h-screeen text-center section-container">
        <h1
          style={{ lineHeight: "1.33" }}
          className=" leading-[1.33rem] text-heading text-2xl sm:text-3xl md:text-5xl font-[900]"
        >
          No Blogs Found for this category <br />{" "}
          <span className="text-3xl">You are at an invalid URL</span>
        </h1>
      </section>
    );
  }

  return (
    <section className="section-container">
      <div className="flex items-center gap-4 mb-4">
        <h1
          style={{ lineHeight: "1.33" }}
          className=" leading-[1.33rem] text-heading text-2xl sm:text-3xl md:text-5xl font-[900]"
        >
          {data[0].category.title}
        </h1>
        <div className="px-4 py-1 font-bold text-xl flex items-center justify-center rounded-lg bg-white text-alpha hover:bg-alpha hover:text-white transition-all duration-300 ease">
          {data.length}
        </div>
      </div>
      <p className="text-text mb-10">
        These are the blogs under the category of{" "}
        <strong>{data[0].category.title}</strong>
      </p>
      <div className="mb-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {data.map((blog: any) => (
          <BigBlogCard key={blog._id} blog={blog} />
        ))}
      </div>
      <Gap />
    </section>
  );
}

// keeping the pagination buttons for future use
{
  /* @Pagination Section */
}
<div className="w-full flex justify-center p-1">
  <div className="flex flex-col items-center justify-center h-14 relative text-center w-full md:w-1/2 bg-white rounded-3xl">
    <span className="text-text">
      Page <strong>1</strong> of <strong> 2</strong>
    </span>
    {/* @Pagination Button */}
    <PaginationButton type="next" />
  </div>
</div>;

function PaginationButton({ type }: { type: "prev" | "next" }) {
  return (
    <button
      className={`text-sm md:text-base absolute ${type === "prev" ? "left-0" : "right-0"} h-12 box-border m-1 appearance-none inline-flex text-center leading-inherit no-underline px-4 py-2 text-white bg-omegaDark border-omegaDark hover:bg-alpha border-0 w-[30%]  items-center  justify-evenly  outline-none  select-none  rounded-full cursor-pointer border-3 border-solid transition-all duration-250 ease`}
    >
      {type === "prev" ? (
        <>
          <MoveLeft /> Previous{" "}
        </>
      ) : (
        <>
          Next <MoveRight />
        </>
      )}
    </button>
  );
}
