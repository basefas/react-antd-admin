<!-- PROJECT SHIELDS -->
[![LICENSE](https://img.shields.io/github/license/basefas/react-antd-admin.svg?style=flat-square)](/LICENSE)
[![Releases](https://img.shields.io/github/release/basefas/react-antd-admin/all.svg?style=flat-square)](https://github.com/basefas/react-antd-admin/releases)
![GitHub Repo stars](https://img.shields.io/github/stars/basefas/react-antd-admin?style=social)

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a>
    <img src="https://raw.githubusercontent.com/basefas/files/main/logo.svg" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">react-antd-admin</h3>

  <p align="center">
    一个使用 React 和 Antd 开发管理系统
    <br />
  </p>
</div>

<!-- Introduction -->

## 简介

react-antd-admin 使用 vite 与 antd v5 开发，包含常用后台使用的基本模块，依赖项少，结构简单，同时提供完整功能的后端程序，可快速用于二次开发及功能扩展。


|           | url                                         | introduction                               |
|-----------|---------------------------------------------|--------------------------------------------|
| backend   | https://github.com/basefas/admin-go         | 使用 Go & Gin 开发的后台管理系统后端           |
| frontend  | https://github.com/basefas/react-antd-admin | 使用 react & vite & antd 开发的后台管理系统前端|


## 页面截图

### 登录页面

![Screen Shot](https://github.com/basefas/files/blob/main/login.png)

### 用户管理

![Screen Shot](https://github.com/basefas/files/blob/main/user.png)

### 分组管理

![Screen Shot](https://github.com/basefas/files/blob/main/group.png)

### 菜单管理

![Screen Shot](https://github.com/basefas/files/blob/main/menu.png)

### 角色及权限管理

![Screen Shot](https://github.com/basefas/files/blob/main/permission.png)


<!-- GETTING STARTED -->

## 快速开始

1. 克隆项目到本地

```
git clone https://github.com/basefas/react-antd-admin
```

2. 安装依赖

```
npm install
```

3. 运行

```
npm run dev
```

<!-- BUILD -->

## Build

1. 本地编译

```
npm run build
```

2. 本地查看编译结果

```
npm run preview
```


2. 使用 docker 编译并打包 docker 镜像

```
docker build -f Dockerfile -t react-antd-admin:<your_version> .
```

> 注：将 `<your_version>` 替换为你需要的版本号

3. 修改配置

本地开发修改 `env.development` 文件修改配置 
打包需在编译前修改 `env.production` 文件修改配置 
可配置项如下

```
# API 的 URL
VITE_API_HOST=http://localhost
# API 的 PORT
VITE_API_PORT=8086
# API 的 超时时间
VITE_API_TIMEOUT=5000
# 用于显示的平台名称
VITE_PLATFORM_NAME=React Antd Admin
```

<!-- LICENSE -->

## 版权声明

react-antd-admin 基于 MIT 协议， 详情请参考 [license](LICENSE)。
