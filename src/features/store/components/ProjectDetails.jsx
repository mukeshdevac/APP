import React, { useState, useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { connectionManager } from '../../../utils/ConnectionManager';
import { toast } from '../../../hooks/useToast';
import ProjectHero from './ProjectHero';
import ProjectTabBar from './ProjectTabBar';
import LearningTab from './LearningTab';
import ReviewsTab from './ReviewsTab';
import CommentsTab from './CommentsTab';
import ProjectActionsSidebar from './ProjectActionsSidebar';

const TAB_CONTENT = {};

const ProjectDetails = ({ project, onBack, onLoad }) => {
  const [activeTab, setActiveTab] = useState('learning');
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [comments, setComments] = useState(project?.comments || []);

  // Derive connection state directly from connectionManager
  const isConnected = !!(connectionManager.port || connectionManager.socket || connectionManager.bleDevice);

  const handleUpload = useCallback(async () => {
    if (!isConnected) {
      toast.error('Please connect your ESP32 first!');
      return;
    }
    setIsUploading(true);
    try {
      await connectionManager.uploadCode(project, setUploadProgress);
      toast.success('Project uploaded successfully!');
    } catch (error) {
      toast.error('Upload failed: ' + error.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [isConnected, project]);

  const handleRun = useCallback(async () => {
    if (!isConnected) { toast.error('Please connect your ESP32 first!'); return; }
    try {
      await connectionManager.runCode();
    } catch (error) {
      toast.error('Run failed: ' + error.message);
    }
  }, [isConnected]);

  const handleStop = useCallback(async () => {
    if (!isConnected) { toast.error('Please connect your ESP32 first!'); return; }
    try {
      await connectionManager.stopCode();
    } catch (error) {
      toast.error('Stop failed: ' + error.message);
    }
  }, [isConnected]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    if (tab !== 'learning') setIsExpanded(false);
  }, []);

  const handleCommentSubmit = useCallback(() => {
    if (!newComment.trim()) return;
    setComments((prev) => [...prev, { user: 'You', text: newComment.trim() }]);
    setNewComment('');
  }, [newComment]);

  if (!project) return null;

  const averageRating =
    project.reviews?.reduce((acc, r) => acc + r.rating, 0) / (project.reviews?.length || 1) || 0;

  return (
    <Motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="container"
      style={{ padding: 'clamp(1rem, 4vw, 2.5rem) var(--spacing-md)' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button className="btn btn-secondary" onClick={onBack} style={{ padding: '8px', minWidth: '44px' }}>
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ fontSize: 'clamp(1.25rem, 4vw, 2rem)', margin: 0 }}>Project Academy</h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isExpanded && activeTab === 'learning' ? '1fr' : 'minmax(0,1fr)',
          gap: '2rem',
        }}
      >
        <style>{`
          @media(min-width: 1024px) {
            .details-layout {
              grid-template-columns: ${isExpanded && activeTab === 'learning' ? '1fr' : '1fr 380px'} !important;
            }
          }
        `}</style>

        <div className="details-layout" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', transition: 'grid-template-columns 0.3s ease' }}>

          {/* Left: Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <ProjectHero project={project} averageRating={averageRating} />

            <div className="glass" style={{ borderRadius: '20px', padding: '1.5rem' }}>
              <ProjectTabBar activeTab={activeTab} onTabChange={handleTabChange} />

              <div style={{ minHeight: '200px' }}>
                <AnimatePresence mode="wait">
                  {activeTab === 'learning' && (
                    <Motion.div key="learning" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <LearningTab 
                        project={project} 
                        isExpanded={isExpanded} 
                        onToggleExpand={() => setIsExpanded((v) => !v)} 
                        onLoad={onLoad}
                      />
                    </Motion.div>
                  )}
                  {activeTab === 'reviews' && (
                    <Motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <ReviewsTab reviews={project.reviews} onLoad={onLoad} />
                    </Motion.div>
                  )}
                  {activeTab === 'comments' && (
                    <Motion.div key="comments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <CommentsTab
                        comments={comments}
                        newComment={newComment}
                        onCommentChange={setNewComment}
                        onSubmit={handleCommentSubmit}
                        onLoad={onLoad}
                      />
                    </Motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right: Sidebar (hidden in expand mode) */}
          <AnimatePresence>
            {(!isExpanded || activeTab !== 'learning') && (
              <Motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <ProjectActionsSidebar
                  project={project}
                  isConnected={isConnected}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                  onLoad={onLoad}
                  onUpload={handleUpload}
                  onRun={handleRun}
                  onStop={handleStop}
                />
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Motion.div>
  );
};

export default ProjectDetails;
