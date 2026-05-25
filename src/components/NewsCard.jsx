import './NewsCard.css';

function NewsCard({ news, index }) {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes}分钟前`;
    } else if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${month}月${day}日 ${hours}:${minutes}`;
    }
  };

  const handleClick = () => {
    if (news.url) {
      window.open(news.url, '_blank', 'noopener,noreferrer');
    }
  };

  const renderSourceName = (source) => {
    if (!source) return '未知来源';
    if (source.includes('@')) {
      return source;
    }
    return source;
  };

  return (
    <article
      className="news-card"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={handleClick}
    >
      <div className="news-card-header">
        <span className="news-card-source">{renderSourceName(news.source)}</span>
        <span className="news-card-time">{formatTime(news.publishTime)}</span>
      </div>

      <h2 className="news-card-title">
        <a href={news.url} target="_blank" rel="noopener noreferrer">
          {news.title}
        </a>
      </h2>

      {news.summary && (
        <p className="news-card-summary">{news.summary}</p>
      )}

      <div className="news-card-tags">
        <span className="news-card-category-tag">{news.category}</span>
        {news.tags && news.tags.map((tag, idx) => (
          <span key={idx} className="news-card-tag">{tag}</span>
        ))}
      </div>

      {news.reason && (
        <div className="news-card-reason">
          <div className="news-card-reason-label">推荐理由</div>
          <p className="news-card-reason-text">{news.reason}</p>
        </div>
      )}
    </article>
  );
}

export default NewsCard;