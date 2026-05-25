import { useState, useEffect } from 'react';
import './Header.css';

function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
    return `${month}月${day}日 周${weekday}`;
  };

  const formatTime = (date) => {
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
          <span className="header-date">{formatDate(currentTime)}</span>
          <span className="header-time">{formatTime(currentTime)}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;