import React, { useContext, useEffect, useState } from 'react';

import { SettingContext } from '../../context';
import registerShortcuts from '../shortcuts/shortcuts';
import Store from '../store';
import type { FancyTabMasterTreeConfig } from './fancy-tab-master-tree';
import { FancyTabMasterTree } from './fancy-tab-master-tree';
import type { TreeData, TreeNode } from './nodes/nodes';

import './style.less';

const messageHandlers: Record<string, (tmTree: FancyTabMasterTree, data: any) => void> = {
    'add-tab': (tmTree, data) => tmTree.createTab(data),
    'remove-tab': (tmTree, data) => tmTree.removeTab(data.tabId),
    'remove-window': (tmTree, data) => tmTree.removeWindow(data.windowId),
    'move-tab': (tmTree, data) => tmTree.moveTab(data.windowId, data.tabId, data.fromIndex, data.toIndex),
    'update-tab': (tmTree, data) => tmTree.updateTab(data),
    'activated-tab': (tmTree, data) => tmTree.activeTab(data.windowId, data.tabId),
    'attach-tab': (tmTree, data) => tmTree.attachTab(data.windowId, data.tabId, data.newIndex),
    'detach-tab': (tmTree, data) => tmTree.detachTab(data.tabId),
    'window-focus': (tmTree, data) => tmTree.windowFocus(data.windowId),
    'add-window': (tmTree, data) => tmTree.createWindow(data),
    'replace-tab': (tmTree, data) => tmTree.replaceTab(data.addedTabId, data.removedTabId),
};

const registerBrowserEventHandlers = (tmTree: FancyTabMasterTree) => {
    chrome.runtime.onMessage.addListener((message) => {
        if (!message?.type || !message?.data) return;
        const handler = messageHandlers[message.type];
        if (handler) {
            handler(tmTree, message.data);
        }
    });
    registerShortcuts(tmTree);
};

export interface TabMasterTreeProps extends FancyTabMasterTreeConfig {
    source?: TreeNode<TreeData>[];
    enableBrowserEventHandler?: boolean;
    onInit?: (tmTree: FancyTabMasterTree) => void;
}

export const TabMasterTree: React.FC<TabMasterTreeProps> = ({ source, onInit, ...otherProps }) => {
    let treeContainer: HTMLElement | null = null;
    const [tabMasterTree, setTabMasterTree] = useState<FancyTabMasterTree | null>(null);
    const { setting } = useContext(SettingContext);
    useEffect(() => {
        const $el = $(treeContainer!);
        const config: FancyTabMasterTreeConfig = { ...otherProps };
        const tmTree = new FancyTabMasterTree($el, config, setting);
        setTabMasterTree(tmTree);
        Store.tree = tmTree.tree;
        const loadedPromise = tmTree.initTree(source).then(() => {
            if (onInit) {
                onInit(tmTree);
            }
        });
        if (otherProps.enableBrowserEventHandler) {
            loadedPromise.then(() => {
                registerBrowserEventHandlers(tmTree);
            });
        }
    }, []);
    useEffect(() => {
        if (tabMasterTree) {
            tabMasterTree.settings = setting;
        }
    }, [setting.autoScrollToActiveTab, setting.createNewTabByLevel, tabMasterTree]);

    useEffect(() => {
        if (source && tabMasterTree) {
            tabMasterTree.initTree(source);
        }
    }, [source, tabMasterTree]);

    return (
        <div className="tree-container">
            <div id="tree" ref={(el) => (treeContainer = el)} />
        </div>
    );
};

TabMasterTree.defaultProps = {
    enableBrowserEventHandler: true,
};
