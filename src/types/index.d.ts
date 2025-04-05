import { Session } from "next-auth";
import Stripe from "stripe";

export type TimestampType = {
  seconds: number;
  nanoseconds: number;
};

export type MessageType = {
  id: string;
  isRead: boolean;
  mediaUrl: string;
  senderId: string;
  timestamp: TimestampType;
} & (
  | {
      type: "quote";
      content: QuoteDetails;
    }
  | {
      type: "text";
      content: string;
    }
  | {
      type: "image";
      content: string;
    }
  | {
      type: "payment";
      content: AdditionalPaymentDataType & {
        transactionId: string;
        amount: number;
      };
    }
  | {
      type: "quoteResponse";
      content: {
        accepted: boolean;
        paymentLink: string;
      };
    }
);

export type ChatType = {
  id: string;
  participantIds: string[];
  createdAt: Date;
  lastMessage: string;
  lastMessageTimestamp: Date;
  updatedAt: Date;

  //details about service
  serviceId: string;
  serviceName: string;
  status: "discussion" | "payment" | "completed";
};

export type RecentChatsReturnType = {
  id: string;
  lastMessage: string;
  participantIds: string[];
  updatedAt: TimestampType;
  createdAt: TimestampType;
  lastMessageTimestamp: TimestampType;
  users: UserType[];

  //details about service
  serviceId: string;
  serviceName: string;
  status: "discussion" | "payment" | "completed" | "ongoing";
};

export type QuoteDetails = {
  serviceId: string; // tells us which service this quote is for
  serviceName: string; // !!!!will come back to this later
  messageId?: string;
  settled: boolean;
  description: string;
  delivery: Delivery;
  budget: number;
  files?: {
    url: string;
    metadata: { name: string; type: string; size: any };
  }[];

  status: "pending" | "accepted" | "rejected";
};

export type PackageType = "basic" | "standard" | "premium";

// Type definitions
export interface Package {
  title: string;
  introduction: string;
  description: string;
  features: string[];
  price: number;
}

export interface Upsell {
  name: string;
  price: number;
}

export type Packages = {
  [key in PackageType]: Package;
};

export type BuyRedirectArgsType = {
  serviceId: string;
  serviceName: string;
  packageType: string;
  package: Package;
  upsells: Upsell[];
  sellerDetails: { name: string; id: string; address: string };

  // only in case of quote
  chatId?: string;
  messageId?: string;
};

type BasicQuoteDetailsType = {
  description: string;
  delivery: string;
  budget: number;
  files?: any[];
};

type AdditionalPaymentDataType =
  | {
      type: "quote";
      // this is what is going to be stored in the database for the quote
      data: {
        serviceId: string;
        serviceName: string;
        quoteDetails: BasicQuoteDetailsType;
      };
    }
  | {
      type: "upfront";
      data: {
        packageType: string;
        baseQuantity: number;
        package: { price: number; title: string; features: string[] };
        selectedUpsells: Upsell[];

        //! will figure this out later
        sellerDetails?: { name: string; id: string; address: string };
      };
    };

export type CheckoutPageDataType =
  | ({
      serviceId: string;
      serviceName: string;
    } & {
      type: "quote";
      data: BasicQuoteDetailsType;
    })
  | ({
      serviceId: string;
      serviceName: string;
    } & {
      type: "upfront";
      data: {
        packageType: string;
        baseQuantity: number;
        package: { price: number; title: string; features: string[] };
        selectedUpsells: Upsell[];

        //! will figure this out later
        sellerDetails?: { name: string; id: string; address: string };
      };
    });

export type respondQuote = (
  accepted: boolean,
  messageId: string
) => Promise<any>;

export type Review = {
  id?: string;
  rating;
  review;
  serviceId;
  serviceName;
  reviewer: Session["user"];
  timestamp: TimestampType;
};

import { Icons } from "@/components/icons";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

// describes the payment data fetched from "payments" collection
type PaymentDataType = {
  transactionId: string;
  buyerDetails: Session["user"];
  amount: number;
  createdAt: string;
  paymentMetadetails: AdditionalPaymentDataType;
};
