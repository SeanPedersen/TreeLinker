import log from 'loglevel';
import browser from 'webextension-polyfill';

import { setLogLevel } from '../config/log-config';
import { setPrevFocusWindowId } from '../storage/basic';
import { TabMasterDB } from '../storage/idb';
import { setIsNewUser, setIsUpdate } from '../storage/user-journey';
import { isContentScriptPage, sendMessageToExt } from './event-bus';

try {
    setLogLevel();

    async function syncTabsCountInBadge() {
        const allTabs = await browser.tabs.query({});
        await browser.action.setBadgeBackgroundColor({ color: '#2b2d31' });
        await browser.action.setBadgeText({ text: allTabs.length.toString() });
    }

    // ext安装后的状态
    browser.runtime.onInstalled.addListener(async (details) => {
        log.debug('Extension installed', details.reason);
        log.debug(__ENV__);
        log.debug(__TARGET__);
        if (details.reason === 'install') {
            await setIsNewUser(true);
        }
        if (
            details.reason === 'update' &&
            details.previousVersion !== '1.0.10' &&
            browser.runtime.getManifest().version === '1.0.10'
        ) {
            await setIsUpdate(true);
        }
        const db = new TabMasterDB();
        await db.initSetting();
        await syncTabsCountInBadge();
    });

    // Clicking the extension icon toggles the side panel
    browser.action.onClicked.addListener((tab) => {
        setPrevFocusWindowId(tab.windowId!);
        chrome.sidePanel.open({ windowId: tab.windowId! });
    });

    // #### 浏览器Fire的事件
    browser.tabs.onCreated.addListener(async (tab) => {
        syncTabsCountInBadge();
        // 1. 如果创建的是contentScript则忽略
        log.debug('[bg]: tab created!', tab);
        if (isContentScriptPage(tab.url) || isContentScriptPage(tab.pendingUrl)) return;

        // 2. 其他TAB，发给contentScript做tree更新
        sendMessageToExt('add-tab', tab);
    });

    browser.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
        syncTabsCountInBadge();
        // optimize 1. 如果删除的是自己怎么办？
        log.debug('[bg]: tab removed!');
        // 如果删除的是extPage，记录window的width/height/left/top到localStorage
        sendMessageToExt('remove-tab', { windowId: removeInfo.windowId, tabId });
    });

    browser.tabs.onUpdated.addListener(async (_tabId, _changeInfo, tab) => {
        log.debug('[bg]: tab updated!', tab);
        sendMessageToExt('update-tab', tab);
    });

    /**
     * 只有同窗口tab前后顺序移动会影响触发这个方法
     */
    browser.tabs.onMoved.addListener((tabId, { windowId, fromIndex, toIndex }) => {
        log.debug('[bg]: tab moved!');
        sendMessageToExt('move-tab', {
            windowId,
            fromIndex,
            toIndex,
            tabId,
        });
    });

    browser.tabs.onActivated.addListener(({ tabId, windowId }) => {
        log.debug('[bg]: tab activated!');
        sendMessageToExt('activated-tab', { windowId, tabId });
    });
    /**
     * 如果没有window会先触发window的创建事件
     *
     */
    browser.tabs.onAttached.addListener((tabId, { newPosition, newWindowId }) => {
        log.debug('[bg]: attached, tabId:', tabId);
        sendMessageToExt('attach-tab', {
            windowId: newWindowId,
            tabId,
            newIndex: newPosition,
        });
    });

    browser.tabs.onDetached.addListener((tabId) => {
        log.debug('[bg]: detached, tabId:', tabId);
        sendMessageToExt('detach-tab', { tabId });
    });

    browser.tabs.onReplaced.addListener((addedTabId, removedTabId) => {
        log.debug('[bg]: replaced, tabId:', addedTabId);
        sendMessageToExt('replace-tab', { addedTabId, removedTabId });
    });
    /**
     * detach tab的时候会触发这个事件
     */
    browser.windows.onCreated.addListener(async (window) => {
        log.debug('[bg]: window create!');
        // Tab detach的时候也会发这个Event
        sendMessageToExt('add-window', window);
    });
    /**
     * 最后一个tab合并到另一个window时会发这个Event
     */
    browser.windows.onRemoved.addListener(async (windowId) => {
        log.debug('[bg]: window remove!');
        sendMessageToExt('remove-window', { windowId });
    });

    browser.windows.onFocusChanged.addListener((windowId) => {
        log.debug('[bg]: window focus changed!');
        sendMessageToExt('window-focus', { windowId });
    });

    browser.commands.onCommand.addListener(async (command) => {
        if (command === 'openTreeLinker') {
            const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });
            if (activeTab?.windowId) {
                chrome.sidePanel.open({ windowId: activeTab.windowId });
            }
        }
    });
} catch (error) {
    log.error(error);
}
