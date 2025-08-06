import { AxiosError } from "axios";
import { toast } from "sonner";

export function getTokenExpiration(token: string): number {
  const payload = JSON.parse(atob(token.split(".")[1]));
  const expInSec = payload.exp;
  const nowInSec = Math.floor(Date.now() / 1000);
  const secondsLeft = expInSec - nowInSec;
  const daysLeft = Math.ceil(secondsLeft / 86400);

  return daysLeft;
}

export function getCookieConfig(token: string) {
  return {
    expires: getTokenExpiration(token),
    sameSite: "Strict" as "Strict",
    secure: process.env.NODE_ENV === "production",
    httpOnly: process.env.NODE_ENV === "production",
  };
}

// Show error toast
export const showError = (error: unknown) => {
  const axiosError = error as AxiosError<any>;
  toast.error(axiosError?.response?.data?.message || "Failed to load profile");
};

// Format ISO to date,time
export function formatDate(isoDate: string): string {
  console.log("ISO Date:", isoDate);
  const date = new Date(isoDate);
  console.log("Formatted Date:", date);
  const options: Intl.DateTimeFormatOptions = {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };
  console.log(
    "Formatted Options:",
    new Intl.DateTimeFormat("en-IN", options).format(date)
  );
  return new Intl.DateTimeFormat("en-IN", options).format(date);
}

// Formate String to Date short/long format
export const convertToDate = (
  date: string | undefined,
  format: "short" | "long" = "short"
): string | undefined => {
  if (date) {
    const d = new Date(date);
    const month = d.getMonth() + 1; // Month is zero-indexed
    const day = d.getDate();
    const year = d.getFullYear();

    if (format === "long") {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${monthNames[d.getMonth()]} ${day}, ${year}`;
    } else {
      return `${day < 10 ? "0" + day : day}/${
        month < 10 ? "0" + month : month
      }/${year}`;
    }
  }
  return undefined;
};

export const convertToPascalCase = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
