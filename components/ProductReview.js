import React from 'react';

export default function ProductReview({ 
  name, 
  brand, 
  rating, 
  image, 
  specs = {}, 
  pros = [], 
  cons = [], 
  affiliateUrl, 
  buttonText = "Check Price on Amazon",
  description 
}) {
  return (
    <div className="product-review-card">
      <div className="product-card-header">
        <div className="product-brand-tag">{brand}</div>
        <h3 className="product-card-title">{name}</h3>
        {rating && (
          <div className="product-rating-box">
            <span className="rating-score">{rating}</span>
            <span className="rating-stars">{"★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating))}</span>
          </div>
        )}
      </div>

      <div className="product-card-body">
        {image && (
          <div className="product-image-container">
            <img src={image} alt={`${brand} ${name}`} className="product-review-image" />
          </div>
        )}

        {description && <p className="product-card-description">{description}</p>}

        {Object.keys(specs).length > 0 && (
          <div className="product-specs-container">
            <h4 className="specs-title">Key Specifications</h4>
            <div className="specs-grid">
              {Object.entries(specs).map(([key, val]) => (
                <div key={key} className="spec-item">
                  <span className="spec-label">{key}:</span>
                  <span className="spec-val">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(pros.length > 0 || cons.length > 0) && (
          <div className="pros-cons-container">
            {pros.length > 0 && (
              <div className="pros-box">
                <h4 className="pros-box-title">Pros</h4>
                <ul className="pros-list">
                  {pros.map((pro, i) => (
                    <li key={i}>{pro}</li>
                  ))}
                </ul>
              </div>
            )}
            {cons.length > 0 && (
              <div className="cons-box">
                <h4 className="cons-box-title">Cons</h4>
                <ul className="cons-list">
                  {cons.map((con, i) => (
                    <li key={i}>{con}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {affiliateUrl && (
        <div className="product-card-footer">
          <a 
            href={affiliateUrl} 
            target="_blank" 
            rel="nofollow sponsored" 
            className="product-cta-btn"
          >
            {buttonText}
            <span className="cta-icon-arrow">→</span>
          </a>
          <span className="footer-disclaimer">Prices accurate at time of writing. Check Amazon for current pricing.</span>
        </div>
      )}
    </div>
  );
}
