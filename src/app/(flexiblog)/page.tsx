import BlogList from "@/components/flexiblog/BlogList";
import BlogListWithMiddle from "@/components/flexiblog/BlogListWithMiddle";
import DownloadReport from "@/components/flexiblog/DownloadReport";
import FourCards from "@/components/flexiblog/FourCards";
import Gap from "@/components/flexiblog/Gap";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { BlogsQueryResult } from "../../../sanity.types";
import { REVALIDATE_TIME_PERIOD } from "@/config/data";

export const revalidate = REVALIDATE_TIME_PERIOD;

export default async function Home() {
  //! must add in every section
  // className=max-w-4xl mx-auto

  const blogsQuery = groq`*[_type == "blog"]{title,description,slug,category->{title,slug},author->{name,image,headline},titleImage,_createdAt}`;
  const data = (await client.fetch(blogsQuery)) as BlogsQueryResult;

  // group all blogs in data into maximum 4 categories
  const groupedBlogs = data.reduce((acc: any[], elm) => {
    const existingCategory = acc.find((blog) => blog.category === elm);
    if (!existingCategory) {
      acc.push({
        category: elm.category,
        blogs: [
          {
            ...elm,
            category: {
              title: elm.category
                ? (elm.category as { title: string }).title
                : "",
              slug: elm.category ? (elm.category as { slug: string }).slug : "",
            },
          },
        ],
      });
    } else {
      existingCategory.blogs.push(elm);
    }
    return acc;
  }, []);

  return (
    <>
      <FourCards />
      <Gap />
      {/* @Ganda Markdown Grid */}
      {/* @BlogLists - FOR ADVERTISING */}
      <BlogList blogsGroup={groupedBlogs[0]} />
      <Gap />
      {/* @BlogListsWithMiddle - FOR CASE STUDIES */}
      <BlogListWithMiddle blogsGroup={groupedBlogs[1]} />
      <Gap />
      {/* @BlogListsWithMiddle - FOR INNOVATION */}
      <BlogListWithMiddle blogsGroup={groupedBlogs[2]} />
      <Gap />
      <DownloadReport />
    </>
  );
}
