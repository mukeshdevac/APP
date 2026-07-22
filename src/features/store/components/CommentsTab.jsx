import React from 'react';
import { User, Send } from 'lucide-react';

const CommentsTab = React.memo(({ comments, newComment, onCommentChange, onSubmit }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      style={{ display: 'flex', gap: '10px' }}
    >
      <input
        className="glass"
        placeholder="Add a comment..."
        value={newComment}
        onChange={(e) => onCommentChange(e.target.value)}
        style={{
          flex: 1,
          padding: '12px 16px',
          border: '1px solid var(--border)',
          color: 'var(--text)',
          background: 'var(--surface-light)',
          borderRadius: '12px',
          outline: 'none',
          fontSize: '0.9rem',
        }}
        aria-label="Comment input"
      />
      <button
        type="submit"
        className="btn btn-primary"
        style={{ height: '44px', width: '44px', padding: 0 }}
        aria-label="Submit comment"
      >
        <Send size={18} />
      </button>
    </form>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {comments?.length > 0 ? comments.map((comment, i) => (
        <div key={i} style={{ display: 'flex', gap: '12px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--surface-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <User size={16} color="var(--text-muted)" />
          </div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{comment.user}</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{comment.text}</p>
          </div>
        </div>
      )) : <p style={{ color: 'var(--text-muted)' }}>No comments yet. Be the first!</p>}
    </div>
  </div>
));

CommentsTab.displayName = 'CommentsTab';

export default CommentsTab;
