import './CategoryBar.css';

const CATEGORIES = [
  { id: 'all', label: '全部' },
  { id: 'crypto', label: '币圈新闻' },
  { id: 'stock', label: '美股/宏观' },
  { id: 'ai', label: 'AI/科技' },
  { id: 'trump', label: '特朗普/政治/监管' },
  { id: 'x-hot', label: 'X热点' },
];

function CategoryBar({ activeCategory, onCategoryChange }) {
  return (
    <div className="category-bar">
      <div className="category-bar-content">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            className={`category-button ${
              activeCategory === category.id ? 'active' : ''
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryBar;