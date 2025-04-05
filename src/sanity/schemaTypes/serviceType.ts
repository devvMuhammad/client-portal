import { defineType } from "sanity";

export const serviceType = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Service Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "serviceIntroduction",
      title: "Inroduction",
      type: "text",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "offers",
      title: "What We Offer?",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "packages",
      title: "Packages",
      type: "object",
      fields: [
        {
          name: "basic",
          title: "Basic Package",
          type: "package",
        },
        {
          name: "standard",
          title: "Standard Package",
          type: "package",
        },
        {
          name: "premium",
          title: "Premium Package",
          type: "package",
        },
      ],
    },
    {
      name: "upsells",
      title: "Upsells",
      type: "array",
      of: [{ type: "upsell" }],
    },
    {
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [{ type: "faq" }],
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    },
  ],
});

// Package object type
export const packageType = defineType({
  name: "package",
  title: "Package",
  type: "object",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "description",
      title: "Description",
      type: "string",
    },
    {
      name: "introduction",
      title: "Introduction",
      type: "text",
    },
    {
      name: "features",
      title: "Features",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "price",
      title: "Price",
      type: "number",
    },
  ],
});

// Upsell object type
export const upsellType = defineType({
  name: "upsell",
  title: "Upsell",
  type: "object",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
    },
    {
      name: "price",
      title: "Price",
      type: "number",
    },
  ],
});

// FAQ object type
export const faqType = defineType({
  name: "faq",
  title: "FAQ",
  type: "object",
  fields: [
    {
      name: "question",
      title: "Question",
      type: "string",
    },
    {
      name: "answer",
      title: "Answer",
      type: "text",
    },
  ],
});
