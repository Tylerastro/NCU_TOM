# NCU TOM: 鹿林天文台觀測管理系統
![License](https://img.shields.io/badge/License-MIT-blue)
![GitHub repo size](https://img.shields.io/github/repo-size/Tylerastro/NCU_TOM)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/tylerastro/NCU_TOM)
[![codecov](https://codecov.io/gh/Tylerastro/NCU_TOM/graph/badge.svg?token=HRARMN5RJZ)](https://codecov.io/gh/Tylerastro/NCU_TOM)
![Codecov](https://img.shields.io/codecov/c/github/Tylerastro/NCU_TOM)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/Tylerastro/NCU_TOM/CI.yml)
![Server](https://img.shields.io/website?url=https%3A%2F%2Ftom.astro.ncu.edu.tw)
[![Better Stack Badge](https://uptime.betterstack.com/status-badges/v2/monitor/165qe.svg)](https://uptime.betterstack.com/?utm_source=status_badge)





# Overview
NCU TOM是基於[Tom's toolkit](https://github.com/TOMToolkit/tom_base)所產生的計畫，為增加使用者體驗以及前後端分離，我們採用Django + Next.js

NCU TOM is a project based on [Tom's toolkit](https://github.com/TOMToolkit/tom_base). To enhance user experience and separate the frontend from the backend, we adopted  Django with Next.js 

## Table of Contents
- [中文](#簡介)
- [English](#introduction)



## 簡介

NCU TOM 是一個專為天文開發的觀測管理系統，目的協助管理觀測目標、排程、數據記錄和分析。瀏覽[NCU TOM](https://tom.astro.ncu.edu.tw)查看最新的上線版本。
目前架構採用Next.js + Django與Django REST Framework 來設計

## 安裝
> 目前CI流程支援Python 3.9, 3.10, 3.11， node 21+


### Docker compose

1. Clone the Repo
`git clone https://github.com/Tylerastro/NCU_TOM.git`

2. Build the docker image
我們建議使用docker-compose.local.yml在本地端啟動並開發。

建立docker image 使用`docker compose -f docker-compose.local.yml --env-file .env.local build`

3. Start the docker container

啟動docker container 使用`docker compose -f docker-compose.local.yml --env-file .env.local up --watch` 啟動檔案監聽，在開發時可以即時看到異動。

4. 造訪 [localhost:3000](http://localhost:3000)觀看目前的版本。

# 加入開發者行列

歡迎所有貢獻！您可以通過以下方式參與：

- 回報錯誤
- 提出建議
- 開發新功能
- 修復程式碼
- ...


# NCU TOM: Lulin Observatory Observation Management System


## Introduction

NCU TOM is an Observation Management System developed specifically for astronomers, aimed at assisting in managing observation targets, scheduling, data recording, and analysis. Visit [NCU TOM](https://tom.astro.ncu.edu.tw) to view the latest online version.

## Installation

> The current CI process supports Python 3.9, 3.10, 3.11, and Node 21+

### Docker compose

1. Clone the Repo
`git clone https://github.com/Tylerastro/NCU_TOM.git`

2. Build the docker image
Use `docker compose -f docker-compose.local.yml --env-file .env.local build` to build the docker image.

3. Start the docker container

Use `docker compose -f docker-compose.local.yml --env-file .env.local up --watch` to start the docker container.

4. Visit [localhost:3000](http://localhost:3000) to view the latest online version.

# Join the Development Team

All contributions are welcome! You can participate in the following ways:

- Report errors
- Make suggestions
- Develop new features
- Fix code
- ...
