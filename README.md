# 丝路问驿

丝路问驿是一款面向甘肃丝路旅行的微信小程序。首页从敦煌、驿门和星河画面进入，沿河西走廊把路线规划、文博导览、补给歇脚、美食和出行安全收在同一条旅程里。

英文名：Silk Road Chronicle。

## 能做什么

首页圆环上的七个入口：

| 入口 | 作用 |
| --- | --- |
| 丝路问驿 | 按预算、天数、年龄和偏好生成路线，并整理成行程单 |
| 风行万里 | 查看已经生成的行程档案 |
| 驼铃余响 | 文创、纹样和旅途手账 |
| 驿站歇脚 | 兰州、敦煌、张掖、天水等地的补给与休息点 |
| 沿途拾景 | 石窟、关隘、丹霞等拍摄点与游览提示 |
| 陇上寻味 | 沿线城市的食单 |
| 安行无忧 | 证件、补水、交通和应急检查 |

另外还有：

- 随行翻译：方言、英语、俄语和民俗提醒
- 丝路影像：上传照片后生成旅途影像
- 城市文博档案、社区动态、游客登录和个人服务
- 紧急救援入口
- AI 管家：回答路线、景点和行前准备问题

界面和景点内容可以直接在微信开发者工具里预览。路线生成、登录和影像生成需要后面的 AI 服务。

## 环境

- 微信开发者工具，基础库建议 3.x
- Node.js 20 或更高版本，仅在本地启动 AI 服务时需要
- 火山方舟 API Key，用于对话和影像生成
- 小程序 AppID。仓库里的 `project.config.json` 写的是项目现用 AppID；换到自己的小程序时，改成自己的 AppID

## 打开小程序

1. 安装并打开[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。
2. 选择「导入项目」，目录选本仓库根目录（包含 `app.json` 的这一层）。
3. AppID 使用测试号，或填入自己的小程序 AppID。
4. 编译后从开场页进入首页。

当前 `app.js` 里的接口已经指向已部署的云托管地址，导入后可以直接试用线上服务。如果要改成自己的服务，替换 `app.js` 里 `globalData` 的这几项：

- `aiButlerEndpoint`
- `wechatLoginEndpoint`
- `seedanceGenerateEndpoint`
- `seedanceUploadEndpoint`
- `seedanceTaskEndpoint`
- `cloudRunEnvId`
- `cloudRunService`

本地调试时，把它们改成下面的地址：

```text
http://127.0.0.1:8787/api/ai-butler/chat
http://127.0.0.1:8787/api/wechat/login
http://127.0.0.1:8787/api/seedance/generate
http://127.0.0.1:8787/api/seedance/generate-file
http://127.0.0.1:8787/api/seedance/task
```

开发者工具需要勾选「不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书」，否则访问本机 `127.0.0.1` 会被拦住。

## 启动本地 AI 服务

在仓库根目录执行：

```powershell
powershell -ExecutionPolicy Bypass -File .\start-ai-butler.ps1
```

第一次运行会询问火山方舟 API Key，并生成 `server/.env`。这个文件只留在本机，不要提交。

也可以手动准备配置：

```powershell
copy server\.env.example server\.env
node server\ai-butler-proxy.js
```

然后编辑 `server/.env`：

- `ARK_API_KEY`：火山方舟 API Key
- `ARK_MODEL`：对话模型 ID，默认 `deepseek-v4-flash-260425`
- `ARK_SEEDANCE_MODEL`：影像模型 ID，默认 `doubao-seedance-1-5-pro-251215`
- `WECHAT_APP_ID`、`WECHAT_APP_SECRET`：需要微信登录时填写
- `LOGIN_TOKEN_SECRET`：换成一串足够长的随机字符串

健康检查：

```powershell
Invoke-RestMethod http://127.0.0.1:8787/health
```

微信开发者工具不会自动拉起这个 Node 服务。电脑重启或终端关掉之后，需要重新运行启动脚本。

云托管部署步骤写在 [server/CLOUDRUN_DEPLOY.md](server/CLOUDRUN_DEPLOY.md)。部署时在云托管控制台配置环境变量，不要把密钥打进代码包。

## 目录

```text
app.js / app.json          小程序入口和页面注册
pages/                     各功能页面
utils/                     AI、路线和内容请求
server/                    AI 管家代理（对话、登录、影像）
start-ai-butler.ps1        本地一键启动
docs/survey_charts/        调研图表脚本
```

## 不要提交的文件

以下文件含有密钥或本机配置，已经写进 `.gitignore`：

- `server/.env`
- `server/cloudrun-env*.json`
- `project.private.config.json`

仓库里只保留 `server/.env.example` 作为配置样例。
