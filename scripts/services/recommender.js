const { callOpenAI, OPENAI_API_KEY } = require('./openai');

const FALLBACK_TEMPLATES = {
  crypto: "加密货币市场波动较大，该消息可能影响短期走势，建议关注。",
  'ai-tech': "AI 技术持续演进，该进展值得关注，建议深入研究。",
  'us-stock': "宏观数据对投资决策有参考价值，建议结合市场整体情况判断。",
  'trump-politics': "政策变化可能影响市场，建议保持关注。",
  'x-trending': "社区热度反映市场关注度，可作为参考维度之一。"
};

const RECOMMENDATION_PROMPT = `You are a news analyst specializing in crypto, AI, US stock markets, and politics.
Given a news item, generate a brief Chinese recommendation reason (one sentence, 30-60 characters).
The recommendation should:
- Be concise and informative
- Help readers understand the potential impact
- Be written in Chinese
- Only output the recommendation, no explanations or quotes

News item:`;

async function generateRecommendation(news) {
  if (!news || !news.title) {
    return '';
  }

  const category = news.category || 'x-trending';
  const title = news.title;
  const summary = news.summary || '';

  if (!OPENAI_API_KEY) {
    return FALLBACK_TEMPLATES[category] || FALLBACK_TEMPLATES['x-trending'];
  }

  try {
    const newsContent = summary ? `${title}\n\n${summary}` : title;

    const messages = [
      { role: 'system', content: RECOMMENDATION_PROMPT },
      { role: 'user', content: newsContent }
    ];

    const recommendation = await callOpenAI(messages, {
      maxTokens: 100,
      temperature: 0.5
    });

    return recommendation;
  } catch (error) {
    console.error('Failed to generate recommendation:', error.message);
    return FALLBACK_TEMPLATES[category] || FALLBACK_TEMPLATES['x-trending'];
  }
}

async function batchGenerateRecommendations(newsList) {
  if (!newsList || newsList.length === 0) {
    return [];
  }

  const results = await Promise.all(
    newsList.map(async (news) => {
      const recommendation = await generateRecommendation(news);
      return {
        ...news,
        recommendation
      };
    })
  );

  return results;
}

module.exports = {
  generateRecommendation,
  batchGenerateRecommendations,
  FALLBACK_TEMPLATES
};