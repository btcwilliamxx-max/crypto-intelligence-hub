import { useState, useEffect } from 'react';
import Header from './components/dark/Header';
import CategoryBar from './components/dark/CategoryBar';
import NewsGrid from './components/dark/NewsGrid';
import { fetchNews } from './services/newsService';
import './App.css';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      try {
        const data = await fetchNews(selectedCategory);
        setNews(data.news);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [selectedCategory]);

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          <CategoryBar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>加载中...</p>
            </div>
          ) : (
            <NewsGrid news={news} lastUpdate={lastUpdate} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;