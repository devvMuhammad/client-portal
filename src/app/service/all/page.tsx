import ServiceCard from "@/components/service/service-card";
import { REVALIDATE_TIME_PERIOD } from "@/config/data";
import { client } from "@/sanity/lib/client";
import { MoveLeft, MoveRight } from "lucide-react";
import { Metadata } from "next";
import { groq } from "next-sanity";

export const revalidate = REVALIDATE_TIME_PERIOD;

export const metadata: Metadata = {
  title: "All Services",
};

export default async function CategoryBlogs() {
  const servicesQuery = groq`
  *[_type == "service"]{
    _id,
    name,
    packages {
      basic {
        price
      }
    }
  }
`;
  const services = await client.fetch(servicesQuery);

  return (
    <section className="section-container py-20">
      <div className="flex items-center gap-4 mb-4">
        <h1
          style={{ lineHeight: "1.33" }}
          className=" leading-[1.33rem] text-heading text-2xl sm:text-3xl md:text-5xl font-[900]"
        >
          View Our Services
        </h1>
        {services.length && (
          <div className="px-4 py-1 font-bold text-xl flex items-center justify-center rounded-lg bg-white text-alpha hover:bg-alpha hover:text-white transition-all duration-300 ease">
            {services.length}
          </div>
        )}
      </div>
      <p className="text-text mb-10">
        Browse through our services and find the one that suits your needs.
      </p>
      <div className="mb-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {services.map((service: any) => (
          <ServiceCard
            key={service._id}
            id={service._id}
            name={service.name}
            price={service.packages.basic.price}
          />
        ))}
      </div>
      {/* @Pagination Section */}
    </section>
  );
}
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
