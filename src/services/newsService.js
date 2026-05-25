export async function fetchNews(category = 'all') {
  try {
    const response = await fetch('/data/news.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    let filtered = data.news || [];
    if (category !== 'all') {
      filtered = filtered.filter(item => item.category === category);
    }
    return {
      news: filtered,
      total: filtered.length,
      lastUpdate: data.lastUpdate || new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return {
      news: [],
      total: 0,
      lastUpdate: null
    };
  }
}