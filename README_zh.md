# ⭐️ Tree Linker

语言：[English](https://github.com/SeanPedersen/TreeLinker/blob/main/README.md) | [中文](https://github.com/SeanPedersen/TreeLinker/blob/main/README_zh.md)

<img src="https://user-images.githubusercontent.com/7566103/226504871-4b8feefa-9cd0-48e1-bf70-e20e866b3ed4.png" width="500">

> 专业的浏览器标签管理器

## 💡 Tree Linker是什么？
Tree Linker是一个浏览器标签侧边栏，更适用于重度信息消费者。
在Tree Linker中即使你有大量的Tab和Window，仍然可以通过树形视图进行归类和整理保持清晰的逻辑性，再进一步的构建自己的链接收藏夹

## ✨ 主要功能
- 🌲 树形垂直标签侧边栏：更多层级并且可以迅速通过拖拽完成更多的Tab操作
- 💾 关闭并保存：清空工作区并聚焦于当下的工作
- 🔒 备份和恢复：支持导出为`.json`和恢复
- 📶 无需联网：所有内容都存在本地，保证自己的信息安全

![1  dnd](https://user-images.githubusercontent.com/7566103/226508940-040c6557-28a9-4bee-94ae-0869a7d18695.gif)

## 📦 安装
- [Chrome商店](https://chrome.google.com/webstore/detail/link-map/jappgmhllahigjolfpgbjdfhciabdnde)
- [Edge Addon](https://microsoftedge.microsoft.com/addons/detail/link-map/penpmngcolockpbmeeafkmbefjijbaej)
- 从[Release](https://github.com/SeanPedersen/TreeLinker/releases)下载`.zip`文件，打开开发模式，解压zip文件，将解压后的文件夹加载到浏览器中。

## 🔒 关于的权限使用
- tabs: 用于支持主要功能，即浏览器标签管理。
- storage: 用于通过indexedDB保存和恢复树形视图的状态。
- activeTab: 在树形视图中显示当前激活的标签。
- windows: 用于支持主要功能，即窗口管理。
- downloads: 扩展程序需要下载.json文件以进行导出功能。
- system.display: 用于初始化树形视图的位置和宽度/高度。
- favicon: 用于初始化那些树中的从未访问过的Tab节点的图标。

## 致谢

Fork 自 [Link Map](https://github.com/GarinZ/link-map)，由 [GarinZ](https://github.com/GarinZ) 开发。

## 有问题或需要帮助？
- [issue](https://github.com/SeanPedersen/TreeLinker/issues)
