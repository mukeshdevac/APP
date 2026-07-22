import React from 'react';
import { Star, Clock } from 'lucide-react';

const ProjectHero = React.memo(({ project, averageRating }) => (
  <div
    className="glass"
    style={{ borderRadius: '24px', overflow: 'hidden', aspectRatio: '16/9', position: 'relative' }}
  >
    <img
      src={project.image}
      alt={project.title}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      loading="lazy"
    />
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '2rem',
        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
        color: 'white',
      }}
    >
      <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', marginBottom: '0.5rem' }}>
        {project.title}
      </h1>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
          <Star size={16} fill="#ffb800" color="#ffb800" />
          {averageRating.toFixed(1)} ({project.reviews?.length || 0} reviews)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
          <Clock size={16} /> {project.time}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--primary)' }}>
          <Star size={16} /> {project.level}
        </span>
      </div>
    </div>
  </div>
));

ProjectHero.displayName = 'ProjectHero';

export default ProjectHero;
