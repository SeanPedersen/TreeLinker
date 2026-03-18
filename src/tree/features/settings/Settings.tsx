import { Button, message, Modal, Select, Slider, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';
import log from 'loglevel';
import { useContext, useState } from 'react';
import browser from 'webextension-polyfill';

import { parseTabOutlinerData } from '../../../import/parse-tab-outliner';
import type { TabOutliner } from '../../../import/parse-tab-outliner';
import type { FontFamily, ThemeType } from '../../../storage/idb';
import { FONT_SIZE_MAX, FONT_SIZE_MIN } from '../../../storage/idb';
import { downloadJsonWithExtensionAPI, generateKeyByTime, getFormattedData } from '../../../utils';
import { SettingContext } from '../../context';
import store from '../store';
import type { TreeData, TreeNode } from '../tab-master-tree/nodes/nodes';
import type { TabData } from '../tab-master-tree/nodes/tab-node-operations';
import { NodeUtils } from '../tab-master-tree/nodes/utils';

import './settings.less';

export interface ExportJsonData {
    rawData: TreeNode<TreeData>[];
    version?: string;
    exportTime?: string;
}

const resetAndImport = (data: ExportJsonData) => {
    NodeUtils.traverse(data.rawData, (node) => {
        node.key = `${generateKeyByTime()}-${node.key}`;
        node.active = false;
        const nodeData = node.data;
        if (nodeData.nodeType === 'tab') {
            node.data.closed = true;
            (nodeData as TabData).tabActive = false;
        } else if (nodeData.nodeType === 'window') {
            node.data.closed = true;
        }
    });

    const tree = store.tree;
    if (!tree) return;
    const rootNode = tree.getRootNode();
    data.rawData.forEach((nodeData) => {
        rootNode.addNode(nodeData, 'child');
    });
};

const handleExport = () => {
    const rawData = store.tree?.toDict();
    const exportJsonData: ExportJsonData = {
        rawData,
        version: __VERSION__,
        exportTime: getFormattedData(),
    };
    const fileName = `link-map-export-${getFormattedData()}.json`;
    downloadJsonWithExtensionAPI(exportJsonData, fileName).then(() => {
        message.success('Export successfully');
    });
};

const Settings = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { setting, setSetting } = useContext(SettingContext);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const hideModal = () => {
        setIsModalOpen(false);
    };

    const handleLinkMapImport = async (file: RcFile) => {
        try {
            const fileContent = await file.text();
            const jsonData: ExportJsonData = JSON.parse(fileContent);
            log.debug('import-data', jsonData);
            resetAndImport(jsonData);
            message.success('Import successfully');
        } catch (error) {
            log.error('import error:', error);
            message.error('Failed to import Link Map data.');
        }
        hideModal();
        return '';
    };

    const handleTabOutlinerImport = async (file: RcFile) => {
        try {
            const fileContent = await file.text();
            const jsonData = JSON.parse(fileContent);
            if (
                !Array.isArray(jsonData) ||
                !jsonData[jsonData.length - 1].type ||
                jsonData[jsonData.length - 1].type !== 11111
            ) {
                message.error('Invalid Tab Outliner data.');
                return '';
            }
            const treeNodeDataArr = parseTabOutlinerData(jsonData as TabOutliner.ExportData);
            resetAndImport({ rawData: treeNodeDataArr });
            message.success('Import successfully');
        } catch (error) {
            log.error('import error:', error);
            message.error('Failed to import Tab Outliner data.');
        }
        hideModal();
        return '';
    };

    const handleThemeChange = async (value: ThemeType) => {
        await store.db.updateSettingPartial({ theme: value });
        setSetting({ ...setting, theme: value });
    };

    const handleFontFamilyChange = async (value: FontFamily) => {
        await store.db.updateSettingPartial({ fontFamily: value });
        setSetting({ ...setting, fontFamily: value });
    };

    const handleFontSizeChange = async (value: number) => {
        await store.db.updateSettingPartial({ fontSize: value });
        setSetting({ ...setting, fontSize: value });
    };

    return (
        <div className="settings-container">
            <div>
                <Button
                    className="settings-btn"
                    type="primary"
                    onClick={showModal}
                    icon={<span className="iconfont icon-settings" />}
                />
            </div>
            <Modal
                title={browser.i18n.getMessage('settings')}
                open={isModalOpen}
                className={'settings-modal'}
                onCancel={hideModal}
                onOk={hideModal}
                footer={null}
            >
                <div className={'setting-section'}>
                    <div className="setting-head divider">
                        {browser.i18n.getMessage('appearance')}
                    </div>
                    <div className="settings-item">
                        <span className="settings-item-desc">
                            {browser.i18n.getMessage('theme')}:
                        </span>
                        <Select
                            value={setting.theme}
                            style={{ width: 120 }}
                            size={'small'}
                            onChange={handleThemeChange}
                            popupClassName={'settings-select-popup'}
                            options={[
                                { value: 'light', label: browser.i18n.getMessage('themeLight') },
                                { value: 'dark', label: browser.i18n.getMessage('themeDark') },
                                { value: 'auto', label: browser.i18n.getMessage('themeAuto') },
                            ]}
                        />
                    </div>
                    <div className="settings-item">
                        <span className="settings-item-desc">
                            {browser.i18n.getMessage('fontFamily')}:
                        </span>
                        <Select
                            value={setting.fontFamily}
                            style={{ width: 140 }}
                            size={'small'}
                            onChange={handleFontFamilyChange}
                            popupClassName={'settings-select-popup'}
                            options={[
                                { value: 'system', label: browser.i18n.getMessage('fontSystem') },
                                { value: 'serif', label: browser.i18n.getMessage('fontSerif') },
                                { value: 'monospace', label: browser.i18n.getMessage('fontMono') },
                            ]}
                        />
                    </div>
                    <div className="settings-item">
                        <span className="settings-item-desc">
                            {browser.i18n.getMessage('fontSize')}:
                        </span>
                        <Slider
                            className="font-size-slider"
                            min={FONT_SIZE_MIN}
                            max={FONT_SIZE_MAX}
                            value={setting.fontSize}
                            onChange={handleFontSizeChange}
                            tooltip={{ formatter: (value) => `${value}px` }}
                        />
                    </div>
                </div>
                <div className={'setting-section'}>
                    <div className="setting-head divider">
                        {browser.i18n.getMessage('settingsImportExport')}
                    </div>
                    <div className="settings-item">
                        <Button className="setting-item-btn" onClick={handleExport}>
                            {browser.i18n.getMessage('exportLinkMapData')}
                        </Button>
                    </div>
                    <div className="settings-item">
                        <Upload
                            name={'file'}
                            action={handleLinkMapImport}
                            fileList={[]}
                            accept={'.json'}
                        >
                            <Button className="setting-item-btn">
                                {browser.i18n.getMessage('importLinkMapData')}
                            </Button>
                        </Upload>
                    </div>
                    <div className="settings-item">
                        <Upload
                            name={'file'}
                            action={handleTabOutlinerImport}
                            fileList={[]}
                            accept={'.json, .tree'}
                        >
                            <Button className="setting-item-btn">
                                {browser.i18n.getMessage('importTabOutlinerData')}
                            </Button>
                        </Upload>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Settings;
