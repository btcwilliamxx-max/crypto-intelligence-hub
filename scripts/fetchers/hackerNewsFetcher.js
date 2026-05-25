import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: ['media:content', 'media:thumbnail']
  }
});

const SOURCE = 'HackerNews';
const HN_API = 'https://hacker-news.firebaseio.com/v0';

export async function fetchHackerNews() {
  try {
    console.log(`[${SOURCE}] 开始获取新闻...`);

    const topStoriesRes = await fetch(`${HN_API}/topstories.json`);
    const topStories = await topStoriesRes.json();
    const top20Ids = topStories.slice(0, 20);

    const items = await Promise.all(
      top20Ids.map(async (id) => {
        try {
          const res = await fetch(`${HN_API}/item/${id}.json`);
          return await res.json();
        } catch {
          return null;
        }
      })
    );

    const news = items
      .filter(Boolean)
      .map((item, index) => {
        const id = `hn_${item.id}`;
        const tags = extractTags(item.title || '');
        const category = determineCategory(item.title || '', tags);

        return {
          id,
          title: item.title || '无标题',
          titleZh: null,
          url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
          source: SOURCE,
          time: item.time ? new Date(item.time * 1000).toISOString() : new Date().toISOString(),
          summary: item.text || '',
          summaryZh: null,
          category,
          tags,
          recommendation: null,
          score: 0
        };
      });

    console.log(`[${SOURCE}] 获取成功，共 ${news.length} 条新闻`);
    return { success: true, source: SOURCE, news };

  } catch (error) {
    console.error(`[${SOURCE}] 获取失败:`, error.message);
    return { success: false, source: SOURCE, news: [], error: error.message };
  }
}

function extractTags(title) {
  const tags = [];
  const lowerTitle = title.toLowerCase();

  const tagMap = {
    'AI': ['ai', 'gpt', 'llm', 'chatgpt', 'openai', 'gemini', 'claude', 'machine learning'],
    'Crypto': ['crypto', 'bitcoin', 'ethereum', 'blockchain', 'defi', 'nft', 'web3'],
    'Security': ['security', 'hack', 'vulnerability', 'breach', 'attack'],
    'Tech': ['tech', 'software', 'programming', 'developer', 'code']
  };

  Object.entries(tagMap).forEach(([tag, keywords]) => {
    if (keywords.some(kw => lowerTitle.includes(kw))) {
      tags.push(tag);
    }
  });

  if (tags.length === 0) {
    tags.push('技术');
  }

  return tags;
}

function determineCategory(title, tags) {
  const lowerTitle = title.toLowerCase();

  if (tags.includes('Crypto')) return 'crypto';
  if (tags.includes('AI')) return 'ai-tech';
  if (tags.includes('Security')) return 'trump-politics';

  return 'ai-tech';
}