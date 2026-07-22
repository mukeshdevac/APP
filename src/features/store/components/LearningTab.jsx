import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { BookOpen, Code, Activity, Sparkles, Maximize2, Minimize2 } from 'lucide-react';
import MCQBlock from './MCQBlock';

const BlockSpan = ({ text, color }) => {
  const getBlockColor = (t) => {
    if (t.includes('Eyes')) return '#33CABD';
    if (t.includes('Emoji')) return '#D65CD6';
    if (t.includes('Motor') || t.includes('Servo')) return '#4C97FF';
    if (t.includes('Sensor') || t.includes('Ultrasonic')) return '#4CBFE6';
    if (t.includes('Wait') || t.includes('Time')) return '#FFAB19';
    if (t.includes('OLED')) return '#475569';
    if (t.includes('SKETCH')) return '#FFD500';
    return '#4C97FF';
  };

  const bgColor = color || getBlockColor(text);
  const isYellow = bgColor === '#FFD500';
  const textColor = isYellow ? '#333' : '#fff';

  return (
    <span
      className="blockly-mockup"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        position: 'relative',
        padding: '4px 12px 4px 16px',
        backgroundColor: bgColor,
        color: textColor,
        borderRadius: '4px',
        fontSize: '0.9rem',
        fontWeight: '500',
        margin: '2px 6px',
        boxShadow: `inset 1px 1px 1px rgba(255,255,255,0.4), inset -1px -1px 2px rgba(0,0,0,0.3)`,
        fontFamily: '"Segoe UI", Tahoma, sans-serif',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        borderLeft: '4px solid rgba(0,0,0,0.1)',
        lineHeight: '1.2'
      }}
    >
      <div style={{ position: 'absolute', top: '-4px', left: '12px', width: '12px', height: '4px', backgroundColor: bgColor, borderRadius: '2px 2px 0 0' }} />
      {text}
      <div style={{ position: 'absolute', bottom: '-4px', left: '12px', width: '12px', height: '4px', backgroundColor: bgColor, borderRadius: '0 0 2px 2px' }} />
    </span>
  );
};

const renderContentWithBlocks = (text) => {
  if (typeof text !== 'string') return text;
  const parts = text.split(/(\[.*?\])/g);
  return parts.map((part, i) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      const content = part.slice(1, -1).trim();
      return <BlockSpan key={i} text={content} />;
    }
    return part;
  });
};

const SectionCard = React.memo(({ section, idx, project, onLoad }) => (
  <Motion.div
    className="glass learning-section-card"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
  >
    <h4 className="learning-section-title">
      <BookOpen size={24} /> {section.title}
    </h4>

    <div className={`learning-section-grid ${section.image ? 'has-image' : ''}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {Array.isArray(section.content)
          ? section.content.map((p, i) => (
              <p key={i} className="learning-section-text">
                {renderContentWithBlocks(p)}
              </p>
            ))
          : (
            <p className="learning-section-text">
              {renderContentWithBlocks(section.content)}
            </p>
          )}

        {section.blocklyXml && (
          <Motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onLoad && onLoad(project, section.blocklyXml)}
            style={{
              alignSelf: 'flex-start',
              marginTop: '1.5rem',
              padding: '14px 28px',
              background: 'linear-gradient(135deg, var(--primary) 0%, #00d2ff 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              fontSize: '1rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 10px 30px rgba(0,136,204,0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            <Sparkles size={20} />
            PROGRAM THIS BLOCK
          </Motion.button>
        )}
      </div>

      {section.image && (
        <Motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
        >
          <img src={section.image} alt={section.title} style={{ width: '100%', height: 'auto', maxHeight: '350px', objectFit: 'cover' }} />
        </Motion.div>
      )}
    </div>
  </Motion.div>
));

const LearningTab = React.memo(({ project, onLoad, isExpanded, onToggleExpand }) => {
  const { educationalContent } = project;
  if (!educationalContent) return null;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      {/* Academy Header & Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ padding: '6px 14px', background: 'var(--primary)', color: 'white', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>
            Lesson Module
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>{project.title}</h2>
        </div>
        
        {onToggleExpand && (
          <button 
            onClick={onToggleExpand}
            style={{
              background: 'var(--surface-light)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '10px 18px',
              borderRadius: '12px',
              color: 'var(--text)',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            {isExpanded ? 'Exit Full Screen' : 'Full Screen Reading'}
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div style={{ 
        maxWidth: isExpanded ? '1000px' : 'none', 
        margin: isExpanded ? '0 auto' : '0',
        width: '100%',
        transition: 'max-width 0.4s ease' 
      }}>
        {educationalContent.sections?.map((section, idx) => (
          <SectionCard key={idx} section={section} idx={idx} project={project} onLoad={onLoad} />
        ))}

        {/* Legacy Support Sections */}
        {educationalContent.codeBreakdown?.length > 0 && (
          <Motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginTop: '4rem' }}>
            <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem', color: 'var(--primary)' }}>
              <Code size={28} /> Code Explorer
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {educationalContent.codeBreakdown.map((item, idx) => (
                <div key={idx} className="glass" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                  <Activity size={20} color="var(--primary)" />
                  <div>
                    <code style={{ fontSize: '1rem', color: 'var(--primary)', fontWeight: '700' }}>{item.command}</code>
                    <p style={{ marginTop: '8px', color: 'var(--text-muted)' }}>{item.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </Motion.div>
        )}

        {/* Quick Challenge */}
        {educationalContent.mcqs?.length > 0 && (
           <Motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginTop: '4rem' }}>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: 'var(--success)' }}>🧠 Quick Challenge</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {educationalContent.mcqs.map((mcq, idx) => (
                <MCQBlock key={idx} mcq={mcq} />
              ))}
            </div>
          </Motion.div>
        )}
      </div>
    </div>
  );
});

LearningTab.displayName = 'LearningTab';
export default LearningTab;
