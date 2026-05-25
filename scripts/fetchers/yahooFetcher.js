import Parser from 'rss-parser';

const parser = new Parser();

const SOURCE = 'Yahoo Finance';

const RSS_URLS = [
  { url: 'https://finance.yahoo.com/news/rssindex', category: 'us-stock' },
  { url: 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=^IXIC', category: 'us-stock' }
];

export async function fetchYahooNews() {
  try {
    console.log(`[${SOURCE}] 开始获取新闻...`);

    const allNews = [];

    for (const feedConfig of RSS_URLS) {
      try {
        const feed = await parser.parseURL(feedConfig.url);
        const items = (feed.items || []).slice(0, 10).map((item, index) => {
          const link = item.link || item.guid || '';
          const uniquePart = `${feedConfig.category}_${index}_${Date.now()}`;
          const id = `yahoo_${Buffer.from(uniquePart).toString('base64').slice(0, 12)}`;

          return {
            id,
            title: item.title || '无标题',
            titleZh: null,
            url: link,
            source: SOURCE,
            time: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
            summary: item.contentSnippet || item.content || '',
            summaryZh: null,
            category: feedConfig.category,
            tags: extractTags(item.title || ''),
            recommendation: null,
            score: 0
          };
        });

        allNews.push(...items);
      } catch (feedError) {
        console.warn(`[${SOURCE}] 获取 ${feedConfig.url} 失败:`, feedError.message);
      }
    }

    if (allNews.length === 0) {
      const mockNews = generateFallbackNews();
      console.log(`[${SOURCE}] 使用备用数据，共 ${mockNews.length} 条新闻`);
      return { success: true, source: SOURCE, news: mockNews };
    }

    console.log(`[${SOURCE}] 获取成功，共 ${allNews.length} 条新闻`);
    return { success: true, source: SOURCE, news: allNews };

  } catch (error) {
    console.error(`[${SOURCE}] 获取失败:`, error.message);
    const mockNews = generateFallbackNews();
    return { success: true, source: SOURCE, news: mockNews };
  }
}

function extractTags(title) {
  const tags = [];
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('fed') || lowerTitle.includes('rate') || lowerTitle.includes('inflation')) {
    tags.push('宏观经济');
  }
  if (lowerTitle.includes('stock') || lowerTitle.includes('market') || lowerTitle.includes('nasdaq')) {
    tags.push('美股');
  }
  if (lowerTitle.includes('bitcoin') || lowerTitle.includes('crypto')) {
    tags.push('加密货币');
  }
  if (lowerTitle.includes('ai') || lowerTitle.includes('tech')) {
    tags.push('AI');
  }

  if (tags.length === 0) {
    tags.push('财经');
  }

  return tags;
}

function generateFallbackNews() {
  const templates = [
    { title: '美股三大指数涨跌互现', category: 'us-stock', tags: ['美股', '指数'] },
    { title: '科技股财报季即将开启', category: 'us-stock', tags: ['科技股', '财报'] },
    { title: '比特币价格小幅回调', category: 'crypto', tags: ['比特币'] },
    { title: 'AI板块持续受到市场关注', category: 'ai-tech', tags: ['AI', '科技'] }
  ];

  return templates.map((template, index) => ({
    id: `yahoo_fallback_${index}`,
    title: template.title,
    titleZh: null,
    url: 'https://finance.yahoo.com',
    source: SOURCE,
    time: new Date(Date.now() - index * 3 * 60 * 60 * 1000).toISOString(),
    summary: `Yahoo Finance 报道：${template.title}`,
    summaryZh: null,
    category: template.category,
    tags: template.tags,
    recommendation: null,
    score: 0
  }));
}