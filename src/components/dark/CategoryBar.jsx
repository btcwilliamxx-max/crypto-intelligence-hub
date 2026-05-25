import './CategoryBar.css';

const CATEGORIES = [
  { id: 'all', label: '全部' },
  { id: 'crypto', label: '币圈' },
  { id: 'us-stock', label: '美股' },
  { id: 'ai-tech', label: 'AI' },
  { id: 'trump-politics', label: '政策' },
  { id: 'x-trending', label: 'X热点' }
];

function CategoryBar({ selectedCategory, onCategoryChange }) {
  return (
    <div className="category-bar">
      <div className="category-scroll">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.id)}
            data-category={category.id}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryBar;