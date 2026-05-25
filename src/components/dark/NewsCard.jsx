import './NewsCard.css';

function NewsCard({ news }) {
  const formatTime = (time) => {
    if (!time) return '';
    const date = new Date(time);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'crypto': '加密货币',
      'us-stock': '美股',
      'ai-tech': 'AI 科技',
      'trump-politics': '政治监管',
      'x-trending': 'X热点'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'crypto': 'var(--color-crypto)',
      'us-stock': 'var(--color-us-stock)',
      'ai-tech': 'var(--color-ai)',
      'trump-politics': 'var(--color-politics)',
      'x-trending': 'var(--color-x-trending)'
    };
    return colors[category] || 'var(--text-tertiary)';
  };

  return (
    <article className="news-card">
      <a href={news.url} target="_blank" rel="noopener noreferrer" className="news-card-link">
        <h3 className="news-title">{news.title}</h3>
        
        {news.summary && (
          <p className="news-summary">{news.summary}</p>
        )}
        
        {news.recommendation && (
          <div className="news-recommendation">
            <span className="recommendation-label">推荐理由</span>
            <p className="recommendation-text">{news.recommendation}</p>
          </div>
        )}
        
        <div className="news-footer">
          <div className="news-tags">
            {news.tags && news.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="news-tag">{tag}</span>
            ))}
          </div>
          
          <div className="news-meta">
            <span className="news-source">{news.source}</span>
            <span className="news-time">{formatTime(news.time)}</span>
          </div>
        </div>
      </a>
    </article>
  );
}

export default NewsCard;