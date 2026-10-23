# 微信云托管部署说明

上传包使用 `slwy-ai-cloudrun.zip`，不要上传旧的 `sever.zip`。

部署页面填写：

- 选择方式：手动上传代码包
- 上传方式：压缩包
- 代码包：`server/slwy-ai-cloudrun.zip`
- 端口：`80`

部署前在高级设置里配置环境变量：

```env
ARK_API_KEY=你的火山方舟 API Key
ARK_MODEL=deepseek-v4-flash-260425
ARK_SEEDANCE_MODEL=doubao-seedance-1-5-pro-251215
ARK_VIDEO_TASK_URL=https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks
WECHAT_APP_ID=你的小程序 AppID
WECHAT_APP_SECRET=你的小程序 AppSecret
LOGIN_TOKEN_SECRET=一串很长的随机字符串
AI_BUTLER_PROXY_PORT=80
```

部署成功后，先访问服务的 `/health` 或在云调用调试里请求 `/health`。通过后，再把小程序端的接口地址从 `127.0.0.1` 改成云托管提供的公网访问地址。
