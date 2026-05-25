import axios from 'axios';

const SEARCH_KEYWORDS = 'stock market economy Trump regulation federal reserve interest rate';

export async function fetchNewsData() {
  try {
    const apiKey = process.env.NEWSDATA_API_KEY;

    if (!apiKey) {
      console.warn('NEWSDATA_API_KEY not configured');
      return [];
    }

    const response = await axios.get('https://newsdata.io/api/1/news', {
      params: {
        apikey: apiKey,
        q: SEARCH_KEYWORDS,
        language: 'en',
        category: 'business'
      },
      timeout: 10000
    });

    if (response.data.status !== 'success' || !response.data.results) {
      return [];
    }

    const news = response.data.results.map((item, index) => ({
      id: `newsdata_${item.article_id || index}`,
      title: item.title || '',
      url: item.link || '',
      source: item.source_id || item.source_name || '',
      time: item.pubDate || item.pubDateISO || '',
      summary: item.description || item.content || '',
      category: item.category?.[0] || 'Market'
    }));

    return news;
  } catch (error) {
    console.error('NewsData.io fetch error:', error.message);
    return [];
  }
}