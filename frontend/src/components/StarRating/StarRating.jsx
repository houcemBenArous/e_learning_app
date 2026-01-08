import './StarRating.css';

function StarRating({ rating, totalReviews, showCount = true, size = 'medium' }) {
  // Round rating to nearest 0.5
  const roundedRating = Math.round(rating * 2) / 2;
  
  const renderStars = () => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        // Full star
        stars.push(
          <span key={i} className={`star full ${size}`}>★</span>
        );
      } else if (i - 0.5 === roundedRating) {
        // Half star
        stars.push(
          <span key={i} className={`star half ${size}`}>★</span>
        );
      } else {
        // Empty star
        stars.push(
          <span key={i} className={`star empty ${size}`}>★</span>
        );
      }
    }
    
    return stars;
  };

  return (
    <div className="star-rating">
      <div className="stars">
        {renderStars()}
      </div>
      {showCount && (
        <span className="rating-info">
          <span className="rating-value">{rating.toFixed(1)}</span>
          {totalReviews !== undefined && (
            <span className="review-count">({totalReviews} reviews)</span>
          )}
        </span>
      )}
    </div>
  );
}

export default StarRating;