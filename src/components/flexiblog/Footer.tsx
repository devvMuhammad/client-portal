import React from "react";
import { SocialIcons } from "../icons";

const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { name: "Advertise with us", href: "https://github.com/shadcn-ui" },
      { name: "About Us", href: "https://github.com/sadmann7" },
      { name: "Contact Us", href: "https://chat.openai.com" },
    ],
  },
  {
    title: "Legal Stuff",
    links: [
      { name: "Privacy Notice", href: "https://github.com/shadcn-ui" },
      { name: "Cookie Policy", href: "https://github.com/sadmann7" },
      { name: "Terms Of Use ", href: "https://chat.openai.com" },
    ],
  },
];

const socialFooterLinks = [
  {
    title: "Social",
    links: [
      { name: "Github", href: "https://github.com", icon: "github" },
      { name: "Twitter", href: "https://twitter.com", icon: "twitter" },
      { name: "Instagram", href: "https://instagram.com", icon: "instagram" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="pt-10 section-container grid grid-cols gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-[auto_1fr_1fr_1fr] md:gap-8">
      <div className="space-y-4">
        <h5 className="text-xl font-bold text-text tracking-wider">
          FlexiBlog
        </h5>
        <p className="text-text transition-colors">
          © 2024, All Rights Reserved
        </p>
      </div>
      {footerLinks.map((section, index) => (
        <div key={index}>
          <h5 className="text-sm font-semibold tracking-wider">
            {section.title}
          </h5>
          <ul className="[&>a]:block [&>a]:pl-2 [&>a:hover]:text-alpha [&>a:hover]:transition-all mt-4 space-y-4 text-text transition-colors [&>li:hover]:text-white [&>li:hover]:cursor-pointer">
            {section.links.map((link, linkIndex) => (
              <a
                key={linkIndex}
                target="_blank"
                rel="noopener noreferrer"
                href={link.href}
              >
                {link.name}
              </a>
            ))}
          </ul>
        </div>
      ))}
      {socialFooterLinks.map((section, index) => (
        <div key={index}>
          <h5 className="text-sm font-semibold  tracking-wider">
            {section.title}
          </h5>
          <ul className=" [&>a]:pl-2 [&>a:hover]:text-alpha [&>a:hover]:transition-all mt-4 space-y-4 text-text transition-colors [&>li:hover]:text-white [&>li:hover]:cursor-pointer">
            {section.links.map((link, linkIndex) => {
              const { Icon: SocialIcon, color } =
                SocialIcons[link.icon as keyof typeof SocialIcons];
              return (
                <a
                  key={linkIndex}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={link.href}
                  className="flex gap-2 items-center"
                >
                  <SocialIcon color={color} />
                  {link.name}
                </a>
              );
            })}
          </ul>
        </div>
      ))}
      {/* <ul className="[&>a]:block [&>a]:pl-2 [&>a:hover]:text-alpha [&>a:hover]:transition-all mt-4 space-y-4 text-text transition-colors [&>li:hover]:text-white [&>li:hover]:cursor-pointer">
            {section.links.map((link, linkIndex) => (
              <a
                key={linkIndex}
                target="_blank"
                rel="noopener noreferrer"
                href={link.href}
              >
                {link.name}
              </a>
            ))}
          </ul> */}
    </footer>
  );
};

export default Footer;
