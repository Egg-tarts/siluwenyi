# AI Butler Proxy

第一次使用：

1. 复制 `server/.env.example` 为 `server/.env`
2. 把 `ARK_API_KEY` 改成你的火山方舟 API Key
3. AR 影像生成默认使用 `ARK_SEEDANCE_MODEL=doubao-seedance-1-5-pro-251215`
4. 微信登录需要填写 `WECHAT_APP_ID` 和 `WECHAT_APP_SECRET`

一键启动：

```powershell
powershell -ExecutionPolicy Bypass -File .\start-ai-butler.ps1
```

手动启动：

```powershell
node server\ai-butler-proxy.js
```

健康检查：

```powershell
Invoke-RestMethod http://127.0.0.1:8787/health
```

小程序 AI 管家默认请求：

```text
http://127.0.0.1:8787/api/ai-butler/chat
```

小程序 AR 影像生成默认请求：

```text
http://127.0.0.1:8787/api/seedance/generate
http://127.0.0.1:8787/api/seedance/generate-file
http://127.0.0.1:8787/api/seedance/task
```

小程序微信登录默认请求：

```text
http://127.0.0.1:8787/api/wechat/login
```

该登录请求会把小程序端传来的 `code` 交给微信 `jscode2session` 换取身份标识，并返回自定义登录态。`session_key` 不会下发给小程序。

如果火山方舟控制台显示的模型 ID 不是 `deepseek-v4-flash-260425`，把 `ARK_MODEL` 改成控制台里的准确 Model ID 或 Endpoint ID。

如果视频生成模型 ID 后续变更，把 `ARK_SEEDANCE_MODEL` 改成控制台里的准确模型 ID。

注意：

微信开发者工具不会自动启动这个本地 Node 服务。每次重启电脑、关闭过终端或服务进程退出后，都需要先运行 `start-ai-butler.ps1`。正式上线时应该把这个服务部署到 HTTPS 服务器，再把小程序里的 `aiButlerEndpoint` 改成线上地址。
