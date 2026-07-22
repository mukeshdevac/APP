import React from 'react';
import { Star } from 'lucide-react';

const ReviewsTab = React.memo(({ reviews }) => {
  if (!reviews?.length) {
    return <p style={{ color: 'var(--text-muted)' }}>No reviews yet.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {reviews.map((review, i) => (
        <div key={i} className="glass" style={{ padding: '1rem', background: 'var(--surface-light)', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: '600' }}>{review.user}</span>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[...Array(5)].map((_, star) => (
                <Star
                  key={star}
                  size={12}
                  fill={star < review.rating ? 'var(--primary)' : 'none'}
                  color="var(--primary)"
                />
              ))}
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{review.comment}</p>
        </div>
      ))}
    </div>
  );
});

ReviewsTab.displayName = 'ReviewsTab';

export default ReviewsTab;
