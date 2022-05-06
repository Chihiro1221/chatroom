# 在线聊天室
学习websocket中随手做的一个小demo，欢迎star
## 技术栈
> 虽然是一个小demo，但依然养成写好文档的习惯。
### 前端
- 开发框架：Vue3
- 构建工具：Vite
- 语法支持：TypeScript
- 组件库：TDesign
- 代码规范：Prettier、ESLint
### 后端
- 语言：JavaScript（Node.js）
- 开发框架：Express
- WebSocket：nodejs-websocket
## 快速开始
### 前端
> 环境要求：Node.js >= 14.0.0

安装依赖
```bash
yarn
```
启动：
```bash
yarn dev
```
部署：
```bash
yarn build
```
### 后端
安装依赖：
```bash
cd server
yarn
```
启动：
```bash
# 建议使用nodemon（安装：npm i -g nodemon）
nodemon main.js
# or
pm2 start main.js
# or 
node main.js
```