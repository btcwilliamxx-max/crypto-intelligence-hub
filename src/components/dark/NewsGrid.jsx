import './NewsGrid.css';
import NewsCard from './NewsCard';
import Loading from './Loading';

function NewsGrid({ news, loading }) {
  if (loading) {
    return (
      <div className="news-grid-container">
        <Loading />
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="news-grid-container">
        <div className="news-empty">
          <div className="empty-icon">📭</div>
          <h3 className="empty-title">暂无内容</h3>
          <p className="empty-description">当前分类下没有找到相关内容</p>
        </div>
      </div>
    );
  }

  return (
    <div className="news-grid-container">
      <div className="news-list">
        {news.map((item, index) => (
          <div 
            key={`${item.id}-${index}`} 
            className="news-list-item"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <NewsCard news={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsGrid;