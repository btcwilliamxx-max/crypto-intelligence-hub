import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; crypto-intelligence-hub/1.0)'
  }
});

const RSS_URL = 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=^GSPC&region=US&lang=en-US';

export async function fetchYahooNews() {
  try {
    const feed = await parser.parseURL(RSS_URL);

    if (!feed.items || feed.items.length === 0) {
      return [];
    }

    const news = feed.items.map((item, index) => ({
      id: `yahoo_${index}_${Date.now()}`,
      title: item.title || '',
      url: item.link || '',
      source: 'Yahoo Finance',
      time: item.pubDate ? new Date(item.pubDate).toISOString() : '',
      summary: item.contentSnippet || item.content || '',
      category: 'Market'
    }));

    return news;
  } catch (error) {
    console.error('Yahoo Finance fetch error:', error.message);
    return [];
  }
}