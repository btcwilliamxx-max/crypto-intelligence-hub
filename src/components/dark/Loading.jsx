import './Loading.css';

function Loading() {
  return (
    <div className="loading-grid">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="skeleton-card" style={{ animationDelay: `${index * 0.08}s` }}>
          <div className="skeleton skeleton-title-1"></div>
          <div className="skeleton skeleton-title-2"></div>
          <div className="skeleton skeleton-summary-1"></div>
          <div className="skeleton skeleton-summary-2"></div>
          <div className="skeleton skeleton-summary-3"></div>
          <div className="skeleton-tags">
            <div className="skeleton skeleton-tag"></div>
            <div className="skeleton skeleton-tag"></div>
            <div className="skeleton skeleton-tag"></div>
          </div>
          <div className="skeleton-footer">
            <div className="skeleton skeleton-source"></div>
            <div className="skeleton skeleton-time"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Loading;