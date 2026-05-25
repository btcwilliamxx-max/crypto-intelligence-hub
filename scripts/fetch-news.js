import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { fetchCryptoCompareNews, fetchHackerNews, fetchNewsDataNews, fetchYahooNews } from './fetchers/index.js';
import { enhanceNewsWithAI } from './services/ai.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'public', 'data', 'news.json');

const fetchers = [
  { name: 'CryptoCompare', fn: fetchCryptoCompareNews },
  { name: 'HackerNews', fn: fetchHackerNews },
  { name: 'NewsData', fn: fetchNewsDataNews },
  { name: 'Yahoo', fn: fetchYahooNews }
];

async function main() {
  console.log('='.repeat(60));
  console.log('📡 加密货币情报聚合 - 新闻抓取开始');
  console.log('='.repeat(60));
  console.log(`⏰ 开始时间: ${new Date().toISOString()}`);
  console.log('');

  let successCount = 0;
  let failCount = 0;
  const results = [];

  console.log('🔍 正在并行获取所有数据源...\n');

  const fetchPromises = fetchers.map(({ name, fn }) =>
    fn().then(result => ({ name, result }))
  );

  const fetchResults = await Promise.allSettled(fetchPromises);

  for (let i = 0; i < fetchResults.length; i++) {
    const promiseResult = fetchResults[i];
    const { name } = fetchers[i];

    if (promiseResult.status === 'fulfilled') {
      const result = promiseResult.value.result;
      if (result && result.success) {
        successCount++;
        results.push(...result.news);
        console.log(`✅ [${name}] 成功获取 ${result.news.length} 条新闻`);
      } else {
        failCount++;
        console.log(`❌ [${name}] 获取失败: ${result?.error || '未知错误'}`);
      }
    } else {
      failCount++;
      console.log(`❌ [${name}] 异常: ${promiseResult.reason?.message || promiseResult.reason}`);
    }
  }

  console.log('');
  console.log('-'.repeat(60));
  console.log(`📊 抓取统计: 成功 ${successCount} 个数据源, 失败 ${failCount} 个数据源`);
  console.log(`📰 原始新闻总数: ${results.length} 条`);
  console.log('');

  if (results.length === 0) {
    console.error('❌ 没有获取到任何新闻，程序终止');
    process.exit(1);
  }

  console.log('🤖 正在调用 AI 服务进行翻译和评分...');
  const enhancedNews = await enhanceNewsWithAI(results);

  console.log('');
  console.log('📋 正在按时间排序...');
  enhancedNews.sort((a, b) => {
    const timeA = new Date(a.time).getTime();
    const timeB = new Date(b.time).getTime();
    return timeB - timeA;
  });

  console.log('💾 正在保存到文件...');
  const outputData = {
    lastUpdate: new Date().toISOString(),
    total: enhancedNews.length,
    news: enhancedNews
  };

  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2), 'utf-8');

  console.log('');
  console.log('='.repeat(60));
  console.log('✅ 新闻抓取完成!');
  console.log('='.repeat(60));
  console.log(`📁 输出文件: ${OUTPUT_FILE}`);
  console.log(`📰 总新闻数: ${outputData.total} 条`);
  console.log(`⏰ 最后更新: ${outputData.lastUpdate}`);
  console.log('');
}

main().catch(error => {
  console.error('\n❌ 程序执行出错:', error);
  process.exit(1);
});