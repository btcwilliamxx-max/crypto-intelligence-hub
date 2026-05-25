import axios from 'axios';

const TECH_KEYWORDS = ['AI', 'artificial intelligence', 'machine learning', 'deep learning',
  'tech', 'technology', 'open source', 'open-source', 'software', 'programming',
  'developer', 'startup', 'google', 'microsoft', 'amazon', 'meta', 'apple', 'nvidia',
  'python', 'javascript', 'rust', 'golang', 'chip', 'semiconductor', 'cloud'];

const HN_BASE_URL = 'https://hacker-news.firebaseio.com/v0';

async function fetchJSON(url) {
  const response = await axios.get(url, { timeout: 10000 });
  return response.data;
}

export async function fetchHackerNews() {
  try {
    const topStories = await fetchJSON(`${HN_BASE_URL}/topstories.json`);

    if (!Array.isArray(topStories) || topStories.length === 0) {
      return [];
    }

    const storyIds = topStories.slice(0, 50);

    const stories = await Promise.all(
      storyIds.map(async (id) => {
        try {
          return await fetchJSON(`${HN_BASE_URL}/item/${id}.json`);
        } catch {
          return null;
        }
      })
    );

    const news = stories
      .filter(story => {
        if (!story || !story.title) return false;
        const titleLower = story.title.toLowerCase();
        return TECH_KEYWORDS.some(keyword => titleLower.includes(keyword.toLowerCase()));
      })
      .map(story => ({
        id: `hn_${story.id}`,
        title: story.title || '',
        url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
        source: 'Hacker News',
        time: story.time ? new Date(story.time * 1000).toISOString() : '',
        summary: story.text || story.title || '',
        category: 'Tech'
      }));

    return news;
  } catch (error) {
    console.error('HackerNews fetch error:', error.message);
    return [];
  }
}