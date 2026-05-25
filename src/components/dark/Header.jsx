import './Header.css';

function Header({ lastUpdate }) {
  const formatDate = (date) => {
    if (!date) {
      date = new Date();
    } else if (!(date instanceof Date)) {
      date = new Date(date);
    }
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[date.getDay()];
    return `${month}月${day}日 ${weekday}`;
  };

  const formatTime = (date) => {
    if (!date) {
      date = new Date();
    } else if (!(date instanceof Date)) {
      date = new Date(date);
    }
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">精选</h1>
          <p className="header-subtitle">AI 自动挑选的高价值内容</p>
        </div>
        <div className="header-right">
          <span className="header-date">{formatDate(lastUpdate)}</span>
          <span className="header-separator">|</span>
          <span className="header-time">{formatTime(lastUpdate)}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;