import axios from 'axios';

const SOURCE_NAME = 'CryptoVision';
const SOURCE_URL = 'https://cryptocurrency.cv';
const API_BASE = SOURCE_URL;

function parseTimeAgo(timeStr) {
  const now = new Date();
  const match = timeStr.match(/(\d+)\s*(m|h|d)\s*ago/i);
  if (!match) return new Date().toISOString();
  
  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  const date = new Date();
  
  if (unit === 'm') date.setMinutes(now.getMinutes() - value);
  else if (unit === 'h') date.setHours(now.getHours() - value);
  else if (unit === 'd') date.setDate(now.getDate() - value);
  
  return date.toISOString();
}

function extractTagsFromCategories(categoryStr) {
  const tagMap = {
    'bitcoin': 'BTC',
    'ethereum': 'ETH',
    'defi': 'DeFi',
    'nft': 'NFT',
    'regulation': '监管',
    'trading': '交易',
    'technology': '技术',
    'sec': 'SEC',
    'etf': 'ETF',
    'institution': '机构'
  };
  
  const tags = [];
  const lowerCat = categoryStr.toLowerCase();
  
  for (const [key, value] of Object.entries(tagMap)) {
    if (lowerCat.includes(key)) {
      tags.push(value);
    }
  }
  
  if (tags.length === 0) tags.push('加密货币');
  
  return [...new Set(tags)];
}

function parseNewsItem(article) {
  const titleEl = article.querySelector('h2, h3');
  const linkEl = article.querySelector('a[href*="/article/"]');
  const metaEl = article.querySelector('a[href*="/article/"]');
  const summaryEl = article.querySelector('p');
  
  if (!titleEl || !linkEl) return null;
  
  const title = titleEl.textContent.trim();
  const url = linkEl.href.startsWith('/') 
    ? `${SOURCE_URL}${linkEl.href}` 
    : linkEl.href;
  
  let source = SOURCE_NAME;
  let time = new Date().toISOString();
  let summary = '';
  
  const metaText = metaEl ? metaEl.textContent : '';
  const sourceMatch = metaText.match(/([A-Za-z\s]+)\s*·/);
  const timeMatch = metaText.match(/(\d+\s*[mhd]\s*ago)/i);
  
  if (sourceMatch) source = sourceMatch[1].trim();
  if (timeMatch) time = parseTimeAgo(timeMatch[0]);
  
  if (summaryEl) {
    summary = summaryEl.textContent.trim();
    if (summary.length > 200) {
      summary = summary.substring(0, 200) + '...';
    }
  }
  
  return {
    id: `cv_${Buffer.from(url).toString('base64').slice(0, 12)}`,
    title,
    titleZh: title,
    url,
    source,
    time,
    summary: summary || '点击查看详情',
    summaryZh: summary || '点击查看详情',
    category: 'crypto',
    tags: ['加密货币'],
    recommendation: null,
    score: 85
  };
}

export async function fetchCryptoVisionNews() {
  console.log('📡 [CryptoVision] 正在获取加密货币新闻...');
  
  try {
    const response = await axios.get(API_BASE, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    
    const html = response.data;
    const news = [];
    
    const articleRegex = /<a href="(\/article\/[^"]+)"[^>]*>[\s\S]*?<h[23][^>]*>([^<]+)<\/h[23]>([\s\S]*?)(?=<\/?(?:a|div|section)[\s>])/g;
    const pageUrl = new URL(API_BASE);
    
    let match;
    while ((match = articleRegex.exec(html)) !== null && news.length < 25) {
      const url = `${SOURCE_URL}${match[1]}`;
      const title = match[2].trim();
      const metaHtml = match[3];
      
      const sourceMatch = metaHtml.match(/([A-Za-z\s·]+)\s*·/);
      const timeMatch = metaHtml.match(/(\d+\s*[mhd]\s*ago)/i);
      const summaryMatch = metaHtml.match(/<p[^>]*>([^<]+)<\/p>/);
      
      let source = SOURCE_NAME;
      let time = new Date().toISOString();
      let summary = '';
      
      if (sourceMatch) source = sourceMatch[1].trim();
      if (timeMatch) time = parseTimeAgo(timeMatch[0]);
      if (summaryMatch) {
        summary = summaryMatch[1].trim();
        if (summary.length > 200) summary = summary.substring(0, 200) + '...';
      }
      
      const id = `cv_${Buffer.from(url).toString('base64').slice(0, 12)}`;
      
      news.push({
        id,
        title,
        titleZh: title,
        url,
        source,
        time,
        summary: summary || '点击查看详情',
        summaryZh: summary || '点击查看详情',
        category: 'crypto',
        tags: ['加密货币'],
        recommendation: null,
        score: 85
      });
    }
    
    if (news.length === 0) {
      const sections = html.split(/(?:<section|<div class="[^"]*article|<div class="[^"]*news)/i);
      const linkRegex = /<a href="(\/article\/[^"]+)"[^>]*>\s*<h[23][^>]*>([^<]+)<\/h[23]>/gi;
      
      while ((match = linkRegex.exec(html)) !== null && news.length < 20) {
        const url = `${SOURCE_URL}${match[1]}`;
        const title = match[2].trim();
        
        const aroundStart = Math.max(0, match.index - 500);
        const aroundEnd = Math.min(html.length, match.index + 500);
        const around = html.substring(aroundStart, aroundEnd);
        
        const sourceMatch = around.match(/([A-Za-z\s·]+)\s*·/);
        const timeMatch = around.match(/(\d+\s*[mhd]\s*ago)/i);
        
        let source = SOURCE_NAME;
        let time = new Date().toISOString();
        
        if (sourceMatch) source = sourceMatch[1].trim();
        if (timeMatch) time = parseTimeAgo(timeMatch[0]);
        
        const id = `cv_${Buffer.from(url).toString('base64').slice(0, 12)}`;
        
        news.push({
          id,
          title,
          titleZh: title,
          url,
          source,
          time,
          summary: '点击查看详情',
          summaryZh: '点击查看详情',
          category: 'crypto',
          tags: ['加密货币'],
          recommendation: null,
          score: 80
        });
      }
    }
    
    console.log(`✅ [CryptoVision] 成功获取 ${news.length} 条加密货币新闻`);
    return news;
    
  } catch (error) {
    console.error(`❌ [CryptoVision] 获取失败: ${error.message}`);
    return [];
  }
}

export default fetchCryptoVisionNews;