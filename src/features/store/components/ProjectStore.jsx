import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Star, ExternalLink, Cpu, Sparkles, Clock, Play, X, ChevronRight } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import AnnouncementCarousel from '../../announcements/components/AnnouncementCarousel';
import { PROJECTS } from '../constants/projects';

const ProjectStore = ({ onSelectProject, onOpenDetails }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedLevel, setSelectedLevel] = useState('All');

    const categories = useMemo(() => {
        const cats = new Set(PROJECTS.map(p => p.category));
        return ['All', ...Array.from(cats).sort()];
    }, []);

    const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

    const filteredProjects = useMemo(() => {
        return PROJECTS.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
            const matchesLevel = selectedLevel === 'All' || project.level === selectedLevel;
            return matchesSearch && matchesCategory && matchesLevel;
        });
    }, [searchQuery, selectedCategory, selectedLevel]);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('All');
        setSelectedLevel('All');
    };

    return (
        <div className="container" style={{ padding: 'clamp(1rem, 4vw, 2.5rem) var(--spacing-md)' }}>
            <AnnouncementCarousel />

            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>Project Store</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)', maxWidth: '600px' }}>
                    Explore {PROJECTS.length}+ curated projects and upload them directly to your ESP32.
                </p>
            </div>

            {/* Discovery Controls */}
            <div className="glass depth-sm" style={{
                padding: '1.5rem',
                borderRadius: '24px',
                marginBottom: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                border: '1px solid var(--border)',
                transformStyle: 'preserve-3d'
            }}>
                {/* Search Bar */}
                <div style={{ position: 'relative', transform: 'translateZ(10px)' }}>
                    <Search
                        size={20}
                        style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                    />
                    <input
                        type="text"
                        placeholder="Search projects by name or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="glass"
                        style={{
                            width: '100%',
                            padding: '14px 16px 14px 48px',
                            background: 'var(--surface-light)',
                            border: '1px solid transparent',
                            borderRadius: '16px',
                            color: 'var(--text)',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'transparent'}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            style={{
                                position: 'absolute',
                                right: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Filters Row */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', transform: 'translateZ(10px)' }}>
                    {/* Categories */}
                    <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    background: selectedCategory === cat ? 'var(--primary)' : 'var(--surface-light)',
                                    color: selectedCategory === cat ? 'white' : 'var(--text-muted)',
                                    border: '1px solid var(--border)',
                                    whiteSpace: 'nowrap',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Difficulty */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Filter size={14} /> Difficulty:
                        </span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {levels.map(level => (
                                <button
                                    key={level}
                                    onClick={() => setSelectedLevel(level)}
                                    style={{
                                        padding: '6px 14px',
                                        borderRadius: '12px',
                                        background: selectedLevel === level ? 'rgba(var(--primary-rgb), 0.15)' : 'transparent',
                                        color: selectedLevel === level ? 'var(--primary)' : 'var(--text-muted)',
                                        border: `1px solid ${selectedLevel === level ? 'var(--primary)' : 'var(--border)'}`,
                                        fontSize: '0.8rem',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <AnimatePresence mode="popLayout">
                {filteredProjects.length > 0 ? (
                    <Motion.div
                        className="store-grid"
                    >
                        {filteredProjects.map((project, index) => (
                            <Motion.div
                                key={project.id}
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.12) }}
                                className="glass tilt-effect store-card"
                                onClick={() => onOpenDetails(project)}
                            >
                                <div className="image-container">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <div className="depth-md store-category-badge" style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        background: 'rgba(0,0,0,0.5)',
                                        backdropFilter: 'blur(4px)',
                                        padding: '4px 8px',
                                        borderRadius: '8px',
                                        fontSize: '0.7rem',
                                        color: 'white',
                                        fontWeight: '600',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        {project.category}
                                    </div>
                                </div>

                                <div className="store-card-body">
                                    <div className="depth-sm store-card-meta" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            background: 'rgba(var(--primary-rgb), 0.1)',
                                            padding: '0.25rem 0.625rem',
                                            borderRadius: '2rem',
                                            color: 'var(--primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontWeight: '600',
                                            border: '1px solid rgba(var(--primary-rgb), 0.2)'
                                        }}>
                                            <Star size={10} style={{ marginRight: '4px' }} /> {project.level}
                                        </span>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            background: 'var(--surface-light)',
                                            padding: '0.25rem 0.625rem',
                                            borderRadius: '2rem',
                                            color: 'var(--text-muted)',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            <Clock size={10} style={{ marginRight: '4px' }} /> {project.time}
                                        </span>
                                    </div>

                                    <h3 className="depth-md" style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>{project.title}</h3>
                                    <p className="depth-sm store-card-desc">
                                        {project.description}
                                    </p>

                                    <div style={{
                                        display: 'flex',
                                        gap: '0.75rem',
                                        marginTop: 'auto'
                                    }}>
                                        <button
                                            className="btn btn-primary"
                                            style={{ flex: 1, padding: '0.75rem', justifyContent: 'center' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onOpenDetails(project);
                                            }}
                                        >
                                            Explore Module
                                        </button>
                                    </div>
                                </div>
                            </Motion.div>
                        ))}
                    </Motion.div>
                ) : (
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            padding: '4rem 2rem',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem'
                        }}
                    >
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'var(--surface-light)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-muted)'
                        }}>
                            <Search size={32} />
                        </div>
                        <h3>No projects found</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters to find what you are looking for.</p>
                        <button className="btn btn-secondary" onClick={clearFilters} style={{ marginTop: '1rem' }}>
                            Clear All Filters
                        </button>
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

ProjectStore.displayName = 'ProjectStore';

export default React.memo(ProjectStore);
