$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$envPath = Join-Path $root "server\.env"
$scriptPath = Join-Path $root "server\ai-butler-proxy.js"

if (-not (Test-Path $envPath)) {
  Write-Host "First run: creating server\.env for local AI butler proxy." -ForegroundColor Yellow
  $arkKey = Read-Host "Paste your Ark API Key"

  if (-not $arkKey) {
    Write-Host "ARK_API_KEY is required." -ForegroundColor Red
    exit 1
  }

  @(
    "ARK_API_KEY=$arkKey",
    "ARK_MODEL=deepseek-v4-flash-260425",
    "ARK_SEEDANCE_MODEL=doubao-seedance-1-5-pro-251215",
    "ARK_VIDEO_TASK_URL=https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks",
    "WECHAT_APP_ID=",
    "WECHAT_APP_SECRET=",
    "LOGIN_TOKEN_SECRET=change_this_to_a_random_long_secret",
    "AI_BUTLER_PROXY_PORT=8787"
  ) | Set-Content -Path $envPath -Encoding UTF8

  Write-Host "Created server\.env." -ForegroundColor Green
}

$running = Get-CimInstance Win32_Process |
  Where-Object { $_.CommandLine -like "*server\ai-butler-proxy.js*" -and $_.CommandLine -notlike "*--check*" }

if ($running) {
  Write-Host "AI butler proxy is already running." -ForegroundColor Green
} else {
  Start-Process -FilePath node -ArgumentList "`"$scriptPath`"" -WorkingDirectory $root -WindowStyle Hidden
  Start-Sleep -Seconds 2
}

try {
  $health = Invoke-RestMethod -Uri "http://127.0.0.1:8787/health" -Method GET
  Write-Host "AI butler proxy ready: http://127.0.0.1:8787" -ForegroundColor Green
  Write-Host "Model: $($health.model)"
  Write-Host "Seedance model: $($health.seedanceModel)"
  Write-Host "WeChat login configured: $($health.hasWechatLogin)"
  Write-Host "Key configured: $($health.hasKey)"
} catch {
  Write-Host "AI butler proxy did not respond. Run node server\ai-butler-proxy.js to view logs." -ForegroundColor Red
  exit 1
}
