# ⭐️ Tree Linker
Language: [English](https://github.com/SeanPedersen/TreeLinker/blob/main/README.md) | [中文](https://github.com/SeanPedersen/TreeLinker/blob/main/README_zh.md)

> Browser Tree Tab Manager for Chrome and Edge

<img src="https://user-images.githubusercontent.com/7566103/226504871-4b8feefa-9cd0-48e1-bf70-e20e866b3ed4.png" width="500">

## 💡 What is Tree Linker?
Tree Linker is a browser tab sidebar that is designed for heavy information consumers.
With Tree Linker, even if you have a large number of tabs and windows, you can manage and classify them in a logical and clear way using the tree view structure, forming your own link collection.

## :sparkles: Features

- 🌲 Tree-shaped vertical tab sidebar, but with more levels: you can use drag-and-drop to quickly complete more tab operations
- 💾 Close and save for later reading: clear your workspace and focus on current work, they will remain in the list
- 🔒 Backup/restore: backup and restore your data in a universal format (JSON) 🔧 TabOutliner import: supports importing data from TabOutliner and is currently supporting more import formats
- 📶 No internet connection required: all content is locally stored, ensuring the security of your information.

![1  dnd](https://user-images.githubusercontent.com/7566103/226508940-040c6557-28a9-4bee-94ae-0869a7d18695.gif)

## 📦 Install
- Download from [Release](https://github.com/SeanPedersen/TreeLinker/releases), unzip the `.zip` file, load the directory into Chrome/Edge from the extension/addon page.
- Upcoming: Chrome and Edge Extension Stores

## 🔒 About Permission Usage
- tabs: For supporting the main feature, which is tab management.
- storage: For Saving and Recovering the tree view status by indexedDB. 
- activeTab: To show currently active tab in the tree view.
- windows: For supporting the main feature, which is window management.
- downloads: Extension need to download `.json` file for the export function
- system.display: To initialize the tree view position and width/height.
- favicon: To initialize icon for tab node which has never been visited.

## Credits

Forked from [Link Map](https://github.com/GarinZ/link-map) by [GarinZ](https://github.com/GarinZ).

## Have problems or need help?
- [issue](https://github.com/SeanPedersen/TreeLinker/issues)
