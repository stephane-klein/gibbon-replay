import { Temporal } from 'temporal-polyfill'

export function convertDatetimeToBrowserTimezone(value) {
    return Temporal.PlainDateTime
        .from(value)
        .toZonedDateTime('UTC')
        .withTimeZone(
            Intl.DateTimeFormat().resolvedOptions().timeZone
        )
        .toString({
            offset: 'never',
            timeZoneName: 'never'
        })
        .replace('T', ' ');
    ;
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
