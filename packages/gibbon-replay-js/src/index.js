import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { record } from '@rrweb/record';

export async function init(recordUrl) {
    let events = [];

    if (!sessionStorage.getItem('rrweb_session_id')) {
        sessionStorage.setItem('rrweb_session_id', crypto.randomUUID());

        navigator.sendBeacon(
            recordUrl,
            JSON.stringify({
                rrweb_session_id: sessionStorage.getItem('rrweb_session_id'),
                screenWidth: window.screen.width,
                screenHeight: window.screen.height,
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                fingerprint: (await (await FingerprintJS.load()).get()).visitorId,
                href: document.location.href
            })
        );
    }
    record({
        emit(event) {
            events.push(event);
        },
    });

    function save() {
        if (events.length > 0) {
            navigator.sendBeacon(
                recordUrl,
                JSON.stringify({
                    events,
                    rrweb_session_id: sessionStorage.getItem('rrweb_session_id')
                })
            );
            events = [];
        }
    }

    setInterval(save, 2 * 1000); // 2 seconds
    window.addEventListener('beforeunload', save);
}

export default { init };
