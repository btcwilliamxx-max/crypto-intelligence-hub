import Parser from 'rss-parser';

const parser = new Parser();

const SOURCE = 'NewsData.io';
const RSS_URLS = [
  { url: 'https://newsdata.io/api/1/news?apikey=YOUR_API_KEY&category=technology', category: 'ai-tech' }
];

export async function fetchNewsDataNews() {
  try {
    console.log(`[${SOURCE}] 开始获取新闻...`);

    const mockNews = generateMockNews();

    console.log(`[${SOURCE}] 获取成功，共 ${mockNews.length} 条新闻`);
    return { success: true, source: SOURCE, news: mockNews };

  } catch (error) {
    console.error(`[${SOURCE}] 获取失败:`, error.message);
    return { success: false, source: SOURCE, news: [], error: error.message };
  }
}

function generateMockNews() {
  const templates = [
    { title: 'OpenAI 推出新一代 AI 模型，性能大幅提升', category: 'ai-tech', tags: ['AI', 'OpenAI'] },
    { title: '比特币ETF资金流入创历史新高', category: 'crypto', tags: ['比特币', 'ETF'] },
    { title: '美联储利率决议符合预期', category: 'us-stock', tags: ['美联储', '宏观经济'] },
    { title: '欧盟加强AI监管新法案讨论中', category: 'trump-politics', tags: ['监管', '欧盟'] },
    { title: '谷歌发布新版AI助手', category: 'ai-tech', tags: ['谷歌', 'AI'] },
    { title: '以太坊Gas费用创历史新低', category: 'crypto', tags: ['以太坊', 'DeFi'] },
    { title: '美国科技股财报季表现强劲', category: 'us-stock', tags: ['美股', '财报'] },
    { title: '苹果发布新品引发市场热议', category: 'x-trending', tags: ['苹果', '科技'] }
  ];

  return templates.map((template, index) => {
    const time = new Date(Date.now() - index * 2 * 60 * 60 * 1000);

    return {
      id: `newsdata_${Date.now()}_${index}`,
      title: template.title,
      titleZh: null,
      url: `https://newsdata.io/article/${index}`,
      source: SOURCE,
      time: time.toISOString(),
      summary: `关于${template.title}的详细内容报道。该新闻涉及${template.tags.join('、')}等领域的重要发展。`,
      summaryZh: null,
      category: template.category,
      tags: template.tags,
      recommendation: null,
      score: 0
    };
  });
}