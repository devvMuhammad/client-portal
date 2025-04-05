import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(seconds: number): string {
  const date = new Date(seconds * 1000);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays <= 7) {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  } else {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(isoString: string | number): string {
  const date = new Date(isoString);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  } satisfies Intl.DateTimeFormatOptions;
  return date.toLocaleDateString("en-US", options);
}

export function formatMessageTimestamp(secondsTimestamp: number): string {
  // Convert the timestamp from seconds to milliseconds
  const date = new Date(secondsTimestamp * 1000);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
  };

  // Check if the date is today
  if (messageDay.getTime() === today.getTime()) {
    return new Intl.DateTimeFormat("default", options).format(date);
  }

  // Check if the date is within this week
  const daysDiff =
    (today.getTime() - messageDay.getTime()) / (1000 * 60 * 60 * 24);
  if (daysDiff < 7) {
    options.weekday = "long";
    return new Intl.DateTimeFormat("default", options).format(date);
  }

  // If the date is older than a week
  options.month = "short";
  options.day = "numeric";
  options.year =
    date.getFullYear() === now.getFullYear() ? undefined : "numeric";

  return new Intl.DateTimeFormat("default", options).format(date);
}

export function formatRecentChatTimestamp(secondsTimestamp: number): string {
  // Convert the timestamp from seconds to milliseconds
  const date = new Date(secondsTimestamp * 1000);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const messageDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  // Check if the date is today
  if (messageDay.getTime() === today.getTime()) {
    return date.toLocaleTimeString("default", {
      hour: "numeric",
      minute: "numeric",
    });
  }

  // Check if the date is yesterday
  if (messageDay.getTime() === yesterday.getTime()) {
    return "Yesterday";
  }

  // Check if the date is within the current week
  const daysDiff =
    (today.getTime() - messageDay.getTime()) / (1000 * 60 * 60 * 24);
  if (daysDiff < 7) {
    return date.toLocaleDateString("default", { weekday: "long" });
  }

  // If the date is older than a week, display the full date
  return date.toLocaleDateString("default", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

export function formatLastSeen(timestamp: number) {
  const now = Date.now(); // Current time in milliseconds
  const secondsAgo = Math.floor((now - timestamp) / 1000);

  const minutesAgo = Math.floor(secondsAgo / 60);
  const hoursAgo = Math.floor(minutesAgo / 60);
  const daysAgo = Math.floor(hoursAgo / 24);
  const weeksAgo = Math.floor(daysAgo / 7);

  if (secondsAgo === 0) {
    return "Just Now";
  } else if (secondsAgo < 60) {
    return secondsAgo === 1 ? "one second ago" : `${secondsAgo} seconds ago`;
  } else if (minutesAgo < 60) {
    return minutesAgo === 1 ? "one minute ago" : `${minutesAgo} minutes ago`;
  } else if (hoursAgo < 24) {
    return hoursAgo === 1 ? "one hour ago" : `${hoursAgo} hours ago`;
  } else if (daysAgo === 1) {
    return "yesterday";
  } else if (daysAgo < 7) {
    return `${daysAgo} days ago`;
  } else if (weeksAgo < 4) {
    return `${weeksAgo} weeks ago`;
  } else {
    const date = new Date(timestamp);
    return date.toLocaleDateString(); // Formats as "MM/DD/YYYY" or according to the user's locale
  }
}
