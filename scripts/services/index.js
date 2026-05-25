const { translateToChinese } = require('./translator');
const { batchGenerateRecommendations } = require('./recommender');

async function enhanceNewsWithAI(newsList) {
  if (!newsList || newsList.length === 0) {
    return [];
  }

  const translatedList = await Promise.all(
    newsList.map(async (news) => {
      if (news.language === 'zh') {
        return news;
      }

      const translatedTitle = await translateToChinese(news.title);
      const translatedSummary = news.summary
        ? await translateToChinese(news.summary)
        : '';

      return {
        ...news,
        title: translatedTitle,
        summary: translatedSummary,
        language: 'zh'
      };
    })
  );

  const enhancedList = await batchGenerateRecommendations(translatedList);

  return enhancedList;
}

module.exports = {
  enhanceNewsWithAI
};