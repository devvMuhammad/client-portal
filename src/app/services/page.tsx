import Footer from "@/components/flexiblog/Footer";
import Gap from "@/components/flexiblog/Gap";
import StickyNavbar from "@/components/flexiblog/StickyNavbar";
import { Icons } from "@/components/icons";
import CustomCard from "@/components/ui/custom-card";
import {
  MailIcon,
  Phone,
  PhoneIcon,
  RouteIcon,
  TabletSmartphoneIcon,
} from "lucide-react";
import Image from "next/image";
import { SprinkleIcon } from "@/components/svgs";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
};

function SectionText() {
  return (
    <div className="mb-20 relative z-20 flex flex-col gap-8 justify-center items-center tracking-wider">
      <div className="flex flex-col gap-12 justify-center items-center mt-20">
        <h3 className="w-3/4 lg:w-1/2 text-center text-3xl font-[900] text-betaLight">
          Our Services
        </h3>
        <h1 className="w-3/4 text-4xl lg:w-1/2 text-center md:text-6xl font-[800] text-white md:leading-[5rem] -translate-y-10 ">
          We change the way you build Gatsby sites.
        </h1>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <main>
      <StickyNavbar />
      {/* @Hero Section */}
      <SprinkleIcon className="absolute top-0 w-full h-screen z-[9] opacity-[0.4]" />
      {/* <section className="mb-20 h-screen grid grid-rows-[auto_1fr] items-center"> */}
      <div className="absolute background top-0 w-full h-screen z-[7]"></div>
      {/* @Hero Section Text */}
      <SectionText />
      {/* @Services Card */}
      <section className="pb-10 bg-flexiBackground">
        <ServicesCard />
        {/* </section> */}

        {/* @Children */}
        {/* <div className="max-w-screen bg-flexiBackground min-h-screen"> */}
        {/* {children} */}
        <Gap />
        <DetailedServicesCard />
        <Gap />
        <CommunityCard />
        <Gap />
        <ContactUsCard />
        <Gap />
        <Gap />
      </section>
      {/* </div> */}
      {/* @Footer */}
      <Footer />
      <Gap />
    </main>
  );
}

function ServicesCard() {
  const services = [
    {
      title: "Business Analytics",
      description:
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.",
    },
    {
      title: "Consulting & Marketing",
      description:
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.",
    },
    {
      title: "Strategic Planning",
      description:
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.",
    },
    {
      title: "Design & Development",
      description:
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.",
    },
  ];

  return (
    <section className="relative z-10 max-w-5xl mx-auto lg:px-0 px-5 sm:px-6">
      <CustomCard className="cursor-default z-20 p-6 md:p-16 bg-white rounded-3xl grid md:grid-cols-2 gap-8">
        <div className="w-full h-full flex items-center ">
          <Image
            src="/images/services.webp"
            alt="blog"
            width={400}
            height={900}
            className="w-full md:w-auto rounded-3xl"
          />
        </div>
        <div className="flex flex-col gap-6">
          {services.map((service, index) => (
            <div key={index} className="space-y-6">
              <h3 className="text-lg text-center md:text-left md:text-2xl font-[800] text-omegaDarker">
                {service.title}
              </h3>
              <p className="text-center md:text-left text-text">
                {service.description}
              </p>
            </div>
          ))}
          <div className="w-full flex justify-center md:justify-start">
            <Link href="/service/all" className="font-bold consultation-button">
              View All Services
            </Link>
          </div>
        </div>
      </CustomCard>
    </section>
  );
}

function DetailedServicesCard() {
  const detailedService = [
    {
      icon: PhoneIcon,
      title: "Marketing solutions for IT business",
      description:
        "As an Internet marketing strategy, SEO considers how search engines work, the computer-programmed algorithms that dictate search engine behavior.",
    },
    {
      icon: TabletSmartphoneIcon,
      title: "Application design & development",
      description:
        "Social media marketing is the use of social media platforms and websites to promote a product or service and is becoming more popular.",
    },
    {
      icon: MailIcon,
      title: "Customer experience Strategy",
      description:
        "Content marketing is a form of marketing focused on creating, publishing, and distributing content for a targeted audience online.",
    },
    {
      icon: RouteIcon,
      title: "Branding & marketing solutions",
      description:
        "Social media marketing is the use of social media platforms and websites to promote a product or service and is becoming more popular.",
    },
  ];
  return (
    <section className="section-container grid grid-cols-1 md:grid-cols-2 gap-10">
      {detailedService.map((service, index) => {
        const Icon = service.icon;
        return (
          <div key={index} className="grid grid-cols-[auto_1fr] gap-6">
            <Icon className="h-12 w-12 text-text" />
            <div className="flex flex-col gap-6">
              <h3 className="text-lg text-left md:text-2xl font-[800] text-omegaDarker">
                {service.title}
              </h3>
              <p className="text-left text-text">{service.description}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function CommunityCard() {
  return (
    <section className="section-container">
      <Image
        src="/images/community.webp"
        alt="Community-Card"
        width={1500}
        height={400}
        className="rounded-xl w-full"
      />
      <Gap />
      <div className=" grid md:grid-cols-[3.5fr_6.5fr] gap-20">
        <h3 className="text-4xl font-[800] text-omegaDarker leading-[3rem]">
          Join our happy community of clients
        </h3>
        <p className=" text-text flex justify-center items-center">
          Mel tota quidam senserit et ut tritani platonem est. In a professional
          context it often happens that private or corporate clients corder a
          publication to be made and presented with the actual content still not
          being ready.
        </p>
      </div>
    </section>
  );
}

function ContactUsCard() {
  return (
    <section className="section-container">
      <CustomCard className="grid md:grid-cols-[1fr_auto] items-center gap-6">
        <div className="flex flex-col">
          <h3 className="text-xl font-[800] text-alpha leading-[3rem]">
            Helping brands to grow and attract more customers
          </h3>
          <p className="text-lg text-text">
            We help our clients achieve tangible, high-impact results.
          </p>
        </div>
        <button className="h-14 px-8 py-4 contact-us-button bg-alphaLighter text-alphaLight rounded-2xl font-bold hover:bg-alphaDark hover:text-white">
          Contact Us Now
        </button>
      </CustomCard>
    </section>
  );
}
