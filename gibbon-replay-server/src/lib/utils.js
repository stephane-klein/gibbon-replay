import { format } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function convertDatetimeToBrowserTimezone(value) {
    return format(
        toZonedTime(
            fromZonedTime(value, "UTC"),
            Intl.DateTimeFormat().resolvedOptions().timeZone
        ),
        "yyyy-MM-dd HH:mm:ss"
    );
}

export function extractTrackCampaign(url) {
    if (url) {
        const urlObj = new URL(url);
        return (
            urlObj.searchParams.get('utm_campaign') || 
            urlObj.searchParams.get('campaign')
        );
    }
}
export function extractSource(url) {
    if (url) {
        const urlObj = new URL(url);
        return (
            urlObj.searchParams.get('utm_source') || 
            urlObj.searchParams.get('ref') ||
            urlObj.searchParams.get('src') ||
            urlObj.searchParams.get('source')
        );
    }
}
