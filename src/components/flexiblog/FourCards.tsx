import Link from "next/link";
import { IconType, Icons } from "../icons";

export default function FourCards() {
  const cards: { name: string; svg: IconType; slug: string }[] = [
    { name: "Advertising", svg: "advertising", slug: "advertising" },
    { name: "Case Studies", svg: "caseStudies", slug: "case-studies" },
    { name: "Innovation", svg: "innovation", slug: "innovation" },
    { name: "Management", svg: "management", slug: "management" },
  ];
  return (
    <section className="w-full overflow-x-auto pt-14 section-container flex md:grid md:grid-cols-4 gap-4 md:gap-2 items-center justify-between">
      {cards.map((card) => {
        const Icon = Icons[card.svg];
        return (
          <Link
            href={`/category/${card.slug}`}
            key={card.name}
            className="min-w-[270px] hovered-shadow group overflow-x-hidden p-4 rounded-xl bg-white flex flex-col gap-4 justify-center items-center hover:-translate-y-2 cursor-pointer"
            style={{
              transition:
                "transform 250ms ease, box-shadow 250ms ease, color 250ms ease",
              boxShadow: "1px 1px 5px 0 rgba(1, 1, 1, 0.05)",
            }}
          >
            <Icon className=" group-hover:text-text h-[32px] w-[32px] text-alpha" />
            <span className="font-semibold text-text">{card.name}</span>
          </Link>
        );
      })}
    </section>
  );
}
