import { type SchemaTypeDefinition } from "sanity";

import { authorType } from "./schemaTypes/authorType";
import { blogType } from "./schemaTypes/blogType";
import {
  faqType,
  packageType,
  serviceType,
  upsellType,
} from "./schemaTypes/serviceType";
import { categoryType } from "./schemaTypes/categoryType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    authorType,
    blogType,
    serviceType,
    packageType,
    upsellType,
    faqType,
    categoryType,
  ],
};
