# NCU TOM: 鹿林天文台觀測管理系統
![License](https://img.shields.io/badge/License-MIT-blue)
![GitHub repo size](https://img.shields.io/github/repo-size/Tylerastro/NCU_TOM)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/tylerastro/NCU_TOM)
[![codecov](https://codecov.io/gh/Tylerastro/NCU_TOM/graph/badge.svg?token=HRARMN5RJZ)](https://codecov.io/gh/Tylerastro/NCU_TOM)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/Tylerastro/NCU_TOM/CI.yml)




# Overview
NCU TOM是基於[Tom's toolkit](https://github.com/TOMToolkit/tom_base)所產生的計畫，為增加使用者體驗以及前後端分離，我們採用Django + Next.js架構而非原本Django一體式架構。

NCU TOM is a project based on [Tom's toolkit](https://github.com/TOMToolkit/tom_base). To enhance user experience and separate the frontend from the backend, we adopted a Django + Next.js architecture instead of the original monolithic Django architecture.

## Table of Contents
- [中文](#簡介)
- [English](#introduction)



## 簡介

NCU TOM 是一個專為天文學家開發的觀測管理系統 (CMS)，目的協助管理觀測目標、排程、數據記錄和分析。瀏覽[NCU TOM](https://tom.astro.ncu.edu.tw)查看最新的上線版本。

目前架構採用Next.js + Django，使用DRF來統一API。

### 安裝
> 目前CI流程支援Python 3.9, 3.10, 3.11， node 21+

### 複製Repo
`git clone https://github.com/Tylerastro/NCU_TOM.git`

### 環境安裝

請先確保你已經使用conda或者python virtualenv等環境設置以及npm來處理前端。

- `pip install -r backend/requirements.txt`
- `npm install --prefix frontend`

#### 使用Sqlite3
如果你沒有安裝PostgreSQL，請使用Sqlite3來建立資料庫。
在`backend/.env.local`當中調整為`django.db.backends.sqlite3`使用Sqlite3。

啟動後端前，請使用`python manage.py migrate`來初始化資料庫。

### 本地端運行
分別在本地執行前後端伺服器：
在frontend目錄下執行`npm run dev`，以及在backend目錄下執行`python manage.py runserver`。

透過[localhost](http://localhost:3000) 即可瀏覽當前版本。


# 加入開發者行列

歡迎所有貢獻！您可以通過以下方式參與：

- 回報錯誤
- 提出建議
- 開發新功能
- 修復程式碼
- ...


# NCU TOM: Lulin Observatory Observation Management System


## Introduction

NCU TOM is an Observation Management System (CMS) developed specifically for astronomers, aimed at assisting in managing observation targets, scheduling, data recording, and analysis. Visit [NCU TOM](https://tom.astro.ncu.edu.tw) to view the latest online version.

The current architecture uses Next.js + Django, with DRF for unified API.

### Installation

> The current CI process supports Python 3.9, 3.10, 3.11, and Node 21+

### Clone the Repo
`git clone https://github.com/Tylerastro/NCU_TOM.git`

### Environment Setup

Please ensure that you have set up an environment using conda or python virtualenv, as well as npm for frontend handling.

- `pip install -r backend/requirements.txt`
- `npm install --prefix frontend`

### Using Sqlite3

If you don't have PostgreSQL installed, you can use Sqlite3 to create a database.
In `backend/.env.local`, change `django.db.backends.postgresql` to `django.db.backends.sqlite3`.

Make sure to start the backend after using `python manage.py migrate` to initialize the database.


### Local Running
Run the frontend and backend servers locally:
Run `npm run dev` in the frontend directory, and `python manage.py runserver` in the backend directory.

You then can browse the current version through [localhost](http://localhost:3000).

# Join the Development Team

All contributions are welcome! You can participate in the following ways:

- Report errors
- Make suggestions
- Develop new features
- Fix code
- ...
