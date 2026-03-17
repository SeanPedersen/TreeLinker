import browser from 'webextension-polyfill';

const EXT_HOME_PAGE_PATH = 'tree.html';

export async function sendMessageToExt(messageId: string, message: unknown) {
    try {
        await chrome.runtime.sendMessage({ type: messageId, data: message });
    } catch {
        // side panel not open, ignore
    }
}

export function isContentScriptPage(url?: string) {
    return url === browser.runtime.getURL(EXT_HOME_PAGE_PATH);
}
