import RelatedBlogs from "@/components/blog/related-blogs";
import { SocialIcons } from "@/components/icons";
import { myPortableTextComponents } from "@/components/portable-text";
import CustomCard from "@/components/ui/custom-card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PortableText, groq } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogSlugQueryResult, SlugsResult } from "../../../../../sanity.types";
import { TypedObject } from "sanity";
import { Metadata } from "next";
import { REVALIDATE_TIME_PERIOD } from "@/config/data";

export const revalidate = REVALIDATE_TIME_PERIOD;
export const metadata: Metadata = {
  title: "Blog",
};

export async function generateStaticParams() {
  const slugs = groq`*[_type == "blog" && defined(slug.current)]{slug}`;
  const data = (await client.fetch(slugs)) as SlugsResult;
  return data.map((blog: any) => ({
    params: { slug: blog.slug.current },
  }));
}

export default async function page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const BlogSlugQuery = groq`*[_type == "blog" && slug.current == $slug]{
    title,
    slug,
    author->{name,headline,image},
    titleImage, 
    text,
    category->{title,slug},
    _createdAt
  }`;
  const data = (await client.fetch(BlogSlugQuery, {
    slug,
  })) as BlogSlugQueryResult;

  if (!data || data.length === 0) return notFound();

  const { title, titleImage, author, category, _createdAt, text } = data[0];
  function extractHeadings(
    blocks: TypedObject[]
  ): { text: string; level: number }[] {
    return blocks
      .filter((block: any) => ["h1", "h2", "h3", "h4"].includes(block.style))
      .map((block: any) => ({
        text: block.children[0].text,
        level: parseInt(block.style.slice(1)),
      }));
  }
  const headings = extractHeadings(text as TypedObject[]);

  return (
    <section className="section-container">
      {/* @Blog Title and Author */}
      <div className="space-y-4 mb-10">
        <h1
          style={{ lineHeight: "1.33" }}
          className="leading-[1.33rem] text-heading text-2xl sm:text-3xl md:text-5xl font-[900]"
        >
          {/* University boosts alumni engagement with nostalgic playlist */}
          {title}
        </h1>
        <div className="text-text flex items-center space-x-2">
          <span className="text-sm sm:text-base leading-relaxed">
            By <strong>{author?.name || "Author"} · </strong>
            Published in{" "}
            <strong>
              {category ? (category as { title: string })?.title : "Blog Title"}{" "}
              ·{" "}
            </strong>
            {formatDate(_createdAt)}{" "}
            <strong className="text-error">· 2 min read</strong>
          </span>
        </div>
      </div>
      <div className="md:grid md:grid-cols-[2fr_1fr] gap-12">
        {/* @Blog Content */}
        <div className="rounded-xl bg-contentBg text-article">
          {/* @Blog Title Page */}
          {titleImage ? (
            <Image
              src={urlFor(titleImage).height(450).width(900).url() as string}
              alt={titleImage?.alt || ""}
              width={450}
              height={900}
              className="w-full h-auto rounded-t-lg"
              sizes="100vw"
            />
          ) : (
            <div className="w-[450px] h-[900px] rounded-xl bg-cyan-200 "></div>
          )}
          {/* @Blog Text Goes Here */}
          <article className="py-8 px-7">
            <PortableText
              value={text as TypedObject[]}
              components={myPortableTextComponents}
            />
          </article>
          <Separator className="my-4" />

          {/* @Previous Article */}
          <div className="m-1 bg-omegaLight p-8 rounded-b-lg">
            <div className="w-1/2 space-y-2">
              <h3 className="text-omegaDark">Previous Article</h3>
              <Link
                href="/2"
                className="block text-heading font-bold leading-tight"
              >
                A Marketer&apos;s Guide To Price Comparison Websties
              </Link>
            </div>
          </div>
        </div>
        {/* @Aside Content */}
        <aside className="hidden md:flex flex-col items-center">
          <div className="flex flex-col gap-14 items-center text-center">
            <AuthorCard author={author as BlogSlugQueryResult[0]["author"]} />
            {headings.length && (
              <>
                <h1 className="text-xl text-text font-bold">
                  Table Of Contents
                </h1>
                <TableOfContents headings={headings} />
              </>
            )}
            <h1 className="text-xl text-text font-bold">Related Posts</h1>
            <RelatedBlogs />
          </div>
        </aside>
      </div>
    </section>
  );
}

function AuthorCard({ author }: { author: BlogSlugQueryResult[0]["author"] }) {
  return (
    <div className="bg-white rounded-xl flex flex-col items-center text-center gap-4 p-8">
      {/* <Avatar> */}
      {author?.image ? (
        <Image
          src={urlFor(author.image).height(150).width(150).url() as string}
          alt={author.image?.alt || ""}
          width={150}
          height={150}
          className="rounded-full"
          sizes="100vw"
        />
      ) : (
        <div className="h-[150px] w-[150px] rounded-xl bg-cyan-200 "></div>
      )}
      {/* </Avatar> */}
      <h2 className="font-bold text-heading text-lg"> {author?.name}</h2>
      <p className="font-bold text-omegaDark text-base">SEO Expert</p>
      <div className="flex justify-around gap-2">
        <div className="h-9 w-9 flex items-center justify-center cursor-pointer rounded-full bg-omegaLighter transition-all duration-200 ease hover:bg-alpha hover:text-white group ">
          <SocialIcons.instagram.Icon
            // color={SocialIcons.instagram.color}
            className="text-red   group-hover:text-white"
          />
        </div>
        <div className="h-9 w-9 flex items-center justify-center cursor-pointer rounded-full bg-omegaLighter transition-all duration-200 ease hover:bg-alpha hover:text-white group ">
          <SocialIcons.twitter.Icon
            // color={SocialIcons.twitter.color}
            className="text-red   group-hover:text-white"
          />
        </div>
        <div className="h-9 w-9 flex items-center justify-center cursor-pointer rounded-full bg-omegaLighter transition-all duration-200 ease hover:bg-alpha hover:text-white group ">
          <SocialIcons.github.Icon
            // color={SocialIcons.github.color}
            className="text-red   group-hover:text-white"
          />
        </div>
      </div>
    </div>
  );
}

function TableOfContents({
  headings,
}: {
  headings: { text: string; level: number }[];
}) {
  return (
    <CustomCard hoverTransition={false} className="flex flex-col gap-4">
      {headings.map((heading, index) => (
        <div key={index} className="flex items-center gap-3">
          <span className="font-bold rounded-full h-6 w-6 flex items-center justify-center bg-omegaLight text-alpha">
            {index + 1}
          </span>
          <Link
            href={`#${heading.text.replace(/\s+/g, "-").toLowerCase()}`}
            className="text-left text-text hover:text-alpha"
          >
            {heading.text}
          </Link>
        </div>
      ))}
    </CustomCard>
  );
}
