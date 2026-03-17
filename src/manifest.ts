import type { ManifestV3Export } from '@crxjs/vite-plugin';

import pkg from '../package.json';

export const commandKeyMap = {
    openLinkMap: 'openLinkMap',
};

const manifest: ManifestV3Export = {
    name: pkg.displayName,
    version: pkg.version,
    description: '__MSG_extDesc__',
    manifest_version: 3,
    minimum_chrome_version: pkg.browserslist.split(' ')[2],
    permissions: [
        'tabs',
        'storage',
        'activeTab',
        'windows',
        'downloads',
        'sidePanel',
        'favicon',
    ],
    web_accessible_resources: [
        {
            matches: ['<all_urls>'],
            resources: ['icons/*', 'images/*', 'fonts/*'],
        },
    ],
    background: {
        service_worker: 'src/background/index.ts',
    },
    default_locale: 'en',
    commands: {
        [commandKeyMap.openLinkMap]: {
            suggested_key: {
                default: 'Shift+Ctrl+L',
                mac: 'Shift+Command+L',
            },
            description: '__MSG_commandTriggerLinkMap__',
        },
    },
    action: {
        default_icon: {
            '16': 'icons/x16.png',
            '32': 'icons/x32.png',
            '48': 'icons/x48.png',
            '128': 'icons/x128.png',
        },
    },
    side_panel: {
        default_path: 'src/tree/tree.html',
    },
    icons: {
        '16': 'icons/x16.png',
        '32': 'icons/x32.png',
        '48': 'icons/x48.png',
        '128': 'icons/x128.png',
    },
};

export default manifest;
