const CATEGORIES = {
  crypto: ['加密货币市场波动加大，建议密切关注大户地址异动和链上数据变化', '该消息可能影响短期市场情绪，建议结合技术面综合判断', 'DeFi 生态持续演进，该项目值得关注其创新机制设计', '机构动向往往是市场转向的先行指标，该消息值得深入研究'],
  'us-stock': ['宏观数据对市场走向有重要参考价值，建议结合利率预期综合分析', '财报季关键信息，可能影响相关板块整体估值水平', '美联储政策走向是当前市场的核心变量，需持续跟踪', '该消息反映了经济基本面的重要变化，对投资决策有参考意义'],
  'ai-tech': ['AI 技术迭代加速，该进展可能重塑行业竞争格局', '大模型能力持续突破，建议关注其实际应用落地情况', 'AI 产品化进程加快，商业模式验证值得关注', '技术突破往往伴随投资机会，建议深入研究其技术细节'],
  'trump-politics': ['政治因素对市场的影响日益显著，该消息需结合地缘政治背景分析', '监管政策变化可能对相关行业产生深远影响', '政策面不确定性增加，建议保持谨慎态度', '重要政治事件可能引发市场波动，需做好风险预案'],
  'x-trending': ['社区热度反映了市场关注度，可作为选股参考维度之一', '社交媒体情绪对短期走势有一定影响，但需理性看待', '该话题引发广泛讨论，说明市场关注度较高', '热点话题往往伴随机会与风险，需独立判断']
};

export async function enhanceNewsWithAI(newsList) {
  console.log('\n[AI 服务] 开始增强新闻数据...');
  console.log(`[AI 服务] 待处理新闻数量: ${newsList.length}`);

  const enhancedNews = newsList.map((news, index) => {
    const category = news.category || 'ai-tech';
    const recommendations = CATEGORIES[category] || CATEGORIES['ai-tech'];
    const recommendationIndex = (news.title?.length || 0 + index) % recommendations.length;

    let titleZh = news.titleZh;
    if (!titleZh && news.title) {
      titleZh = translateToChinese(news.title);
    }

    let summaryZh = news.summaryZh;
    if (!summaryZh && news.summary) {
      summaryZh = translateToChinese(news.summary);
    }

    const score = calculateScore(news);

    return {
      ...news,
      titleZh: titleZh || news.title,
      summaryZh: summaryZh || news.summary,
      recommendation: recommendations[recommendationIndex],
      score
    };
  });

  console.log(`[AI 服务] 增强完成，共处理 ${enhancedNews.length} 条新闻`);
  return enhancedNews;
}

function translateToChinese(text) {
  const translations = {
    'bitcoin': '比特币',
    'btc': '比特币',
    'ethereum': '以太坊',
    'eth': '以太坊',
    'ai': 'AI',
    'crypto': '加密',
    'stock': '股票',
    'market': '市场',
    'price': '价格',
    'news': '新闻',
    'report': '报道',
    'analysis': '分析',
    'update': '更新',
    'launch': '发布',
    'announce': '宣布',
    'rise': '上涨',
    'fall': '下跌',
    'high': '高',
    'low': '低',
    'new': '新',
    'best': '最佳',
    'top': '顶级'
  };

  let translated = text;
  Object.entries(translations).forEach(([en, zh]) => {
    const regex = new RegExp(`\\b${en}\\b`, 'gi');
    translated = translated.replace(regex, zh);
  });

  return translated;
}

function calculateScore(news) {
  let score = 50;

  if (news.time) {
    const hoursAgo = (Date.now() - new Date(news.time).getTime()) / (1000 * 60 * 60);
    if (hoursAgo < 1) score += 30;
    else if (hoursAgo < 6) score += 20;
    else if (hoursAgo < 24) score += 10;
    else score -= 10;
  }

  const hotKeywords = ['bitcoin', 'ethereum', 'ai', 'openai', 'fed', 'sec', 'etf', 'breaking'];
  const lowerTitle = (news.title || '').toLowerCase();
  hotKeywords.forEach(keyword => {
    if (lowerTitle.includes(keyword)) score += 5;
  });

  return Math.min(100, Math.max(0, score));
}