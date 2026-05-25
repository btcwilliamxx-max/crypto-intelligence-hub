import NewsCard from './NewsCard';
import './NewsList.css';

function NewsList({ news, loading, activeCategory }) {
  if (loading) {
    return (
      <div className="news-list">
        <div className="news-list-content">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="news-card-skeleton">
              <div className="skeleton-header">
                <div className="skeleton-source"></div>
                <div className="skeleton-time"></div>
              </div>
              <div className="skeleton-title"></div>
              <div className="skeleton-title short"></div>
              <div className="skeleton-summary"></div>
              <div className="skeleton-summary"></div>
              <div className="skeleton-summary short"></div>
              <div className="skeleton-tags">
                <div className="skeleton-tag"></div>
                <div className="skeleton-tag"></div>
              </div>
              <div className="skeleton-reason"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="news-list">
        <div className="news-list-content">
          <div className="news-list-empty">
            <div className="empty-icon">📭</div>
            <div className="empty-title">暂无内容</div>
            <div className="empty-description">
              {activeCategory === 'all'
                ? '暂无最新资讯，请稍后再试'
                : '该分类下暂无内容，请尝试其他分类'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="news-list">
      <div className="news-list-content">
        {news.map((item, index) => (
          <NewsCard key={item.id || index} news={item} index={index} />
        ))}
      </div>
    </div>
  );
}

export default NewsList;