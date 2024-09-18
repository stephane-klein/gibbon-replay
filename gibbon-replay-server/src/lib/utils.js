import { format } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

export function convertDatetimeToBrowserTimezone(value) {
    return format(
        toZonedTime(
            fromZonedTime(value, "UTC"),
            Intl.DateTimeFormat().resolvedOptions().timeZone
        ),
        "yyyy-mm-dd HH:MM:SS"
    )
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
