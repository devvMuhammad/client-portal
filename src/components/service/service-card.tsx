import Image from "next/image";
import CustomCard from "../ui/custom-card";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function ServiceCard({
  id,
  name,
  price,
  smallButton = true,
}: {
  smallButton?: boolean;
  name: string;
  price: number;
  id: string;
}) {
  return (
    <CustomCard
      override={true}
      className="cursor-default bg-white rounded-2xl card-hover pt-2 pl-2 pr-2 pb-8 flex flex-col hover:-translate-y-2"
    >
      {/* @Blog Image */}
      <Image
        src="/images/placeholder-blog-image.webp"
        height={400}
        width={400}
        className="w-full h-auto rounded-lg"
        alt="blog-image"
      />
      {/* @Text Part */}
      <div
        className={`ml-2 flex-1 flex flex-col gap-2 ${!smallButton && "mt-4"}`}
      >
        {/* @Title */}
        <p className=" mt-4 text-black font-bold text-lg truncate-lines-3">
          {/* A Marketer's Guide to Price Comparison Websites With The Best Tools */}
          {name}
        </p>
        {/* @Author Details */}
        <article className="flex-1">
          Starting from{" "}
          <span className="font-bold">{formatCurrency(price)}</span>
        </article>
        {smallButton && (
          <div className="mb-2 mt-4">
            <Link href={`/service/${id}`} className="category-blog-button">
              Click Here to Buy
            </Link>
          </div>
        )}
      </div>
    </CustomCard>
  );
}
