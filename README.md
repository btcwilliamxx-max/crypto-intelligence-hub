# 加密市场情报雷达

实时聚合加密货币、美股、AI科技、政治监管等多维度资讯的情报看板

## 特性列表

- 多源数据聚合（CryptoVision、Hacker News、NewsData.io、Yahoo Finance）
- AI 智能翻译（英文内容自动翻译为中文）
- AI 推荐理由（为每条新闻生成一句话推荐）
- 定时自动更新（每小时一次）
- 响应式深色主题设计
- 免费部署到 GitHub Pages

## 技术栈

Vite + React + Node.js

## 快速开始

```bash
git clone <repo>
cd crypto-intelligence-hub
npm install
cp .env.example .env
# 填写 .env 中的 API Key
npm run fetch-news  # 本地测试抓取
npm run dev          # 本地开发
```

## API Key 配置

- OPENAI_API_KEY: OpenAI API Key（用于翻译和生成推荐理由）
- NEWSDATA_API_KEY: NewsData.io API Key（美股/宏观/政治新闻，可选）
- CryptoVision: 币圈新闻（**免费，无需 API Key**）

## 部署指南

- Fork 本仓库
- 在 GitHub Settings → Secrets 添加 API Key
- 启用 GitHub Pages（Settings → Pages → Source: GitHub Actions）
- 自动部署后访问 https://[username].github.io/crypto-intelligence-hub/

## 目录结构

```
├── scripts/
│   ├── fetch-news.js      # 抓取主脚本
│   ├── fetchers/          # 各数据源抓取器
│   └── services/          # AI 服务
├── src/
│   ├── components/        # React 组件
│   ├── services/          # 前端服务
│   └── styles/            # 样式
├── public/data/           # 生成的新闻数据
└── .github/workflows/     # CI/CD 配置
```

## License

MIT