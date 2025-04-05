import { z } from "zod";

// First, let's define the schemas for the nested types
const BasicQuoteDetailsSchema = z.object({
  // Add fields for BasicQuoteDetailsType here
  // For example:
  budget: z.number(),
  description: z.string(),
  delivery: z.string(),
  // Add other fields as needed
  files: z
    .array(
      z.object({
        // Add fields for Files type here
        // For example:
        url: z.string(),
        name: z.string(),
        // Add other fields as needed
      })
    )
    .optional()
    .nullable(),
});

const PackageSchema = z.object({
  // Add fields for Package type here
  // For example:
  id: z.string(),
  title: z.string(),
  price: z.number(),
  // Add other fields as needed
});

const UpsellSchema = z.object({
  // Add fields for Upsell type here
  // For example:
  id: z.string(),
  title: z.string(),
  price: z.number(),
  // Add other fields as needed
});

// Now, let's create the AdditionalPaymentDataSchema
const AdditionalPaymentDataSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("quote"),
    data: z.object({
      serviceId: z.string(),
      serviceName: z.string(),
      quoteDetails: BasicQuoteDetailsSchema,
    }),
  }),
  z.object({
    type: z.literal("upfront"),
    data: z.object({
      packageType: z.string(),
      baseQuantity: z.number(),
      package: PackageSchema,
      selectedUpsells: z.array(UpsellSchema),
      sellerDetails: z
        .object({
          name: z.string(),
          id: z.string(),
          address: z.string(),
        })
        .optional(),
    }),
  }),
]);

// You can export this schema for use in other parts of your application
export { AdditionalPaymentDataSchema };
