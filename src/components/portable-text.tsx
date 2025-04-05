import { urlFor } from "@/sanity/lib/image";
import { PortableTextReactComponents } from "next-sanity";
import Image from "next/image";

const generateId = (text: string): string => {
  if (typeof text !== "string") return "";
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
    .trim(); // Trim leading/trailing spaces or hyphens
};

function createHeadingComponent(Tag: "h1" | "h2" | "h3" | "h4") {
  const HeadingComponent = ({ children }: any) => {
    let id = "";
    console.log("children", children);
    try {
      if (Array.isArray(children)) {
        if (typeof children[0] === "string") {
          // Handle case where children is [ 'Introduction' ]
          id = generateId(children[0]);
        } else if (children[0]?.props?.text) {
          // Handle case where children is [{ props: { text: 'Introduction' } }]
          id = generateId(children[0].props.text);
        }
      } else if (typeof children === "string") {
        id = generateId(children);
      }
    } catch (error) {
      console.error(`Error generating ID for ${Tag}:`, error);
    }

    const className = {
      h1: "text-4xl font-extrabold text-gray-800 leading-tight mb-6",
      h2: "text-3xl font-bold text-gray-700 leading-snug mb-5",
      h3: "text-2xl font-bold text-gray-600 leading-relaxed mb-4",
      h4: "text-xl font-bold text-gray-600 leading-normal",
    }[Tag];

    return (
      <Tag id={id} className={className}>
        {children}
      </Tag>
    );
  };
  HeadingComponent.displayName = `Heading${Tag.toUpperCase()}`;
  return HeadingComponent;
}

export const myPortableTextComponents: Partial<PortableTextReactComponents> = {
  types: {
    image: ({ value }: { value: File }) => (
      <Image
        className="w-full max-w-3xl mx-auto my-8 rounded-lg shadow-md"
        src={urlFor(value).url()}
        width={500}
        height={500}
        alt="Blog Image"
      />
    ),
  },
  block: {
    h1: createHeadingComponent("h1"),
    h2: createHeadingComponent("h2"),
    h3: createHeadingComponent("h3"),
    h4: createHeadingComponent("h4"),
    normal: ({ children }: any) => (
      <p className="md:text-xl md:leading-loose text-article leading-loose mb-4">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-600 mb-4">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-outside pl-5 mb-4 text-gray-700">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-outside pl-5 mb-4 text-gray-700">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li className="md:text-xl md:leading-loose text-article leading-loose mb-4">
        {children}
      </li>
    ),
    number: ({ children }: any) => (
      <li className="mb-3 leading-relaxed text-lg">{children}</li>
    ),
  },
  marks: {
    em: ({ children }: any) => (
      <em className="text-gray-600 italic">{children}</em>
    ),
    strong: ({ children }: any) => (
      <strong className="text-gray-900 font-semibold">{children}</strong>
    ),
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        className="text-blue-600 underline hover:text-blue-800"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
};
