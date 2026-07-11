import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import resumeService from '../../services/resumeService';

/**
 * ResumeUploadContent — drag & drop upload with real backend integration.
 */
const ResumeUploadContent = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragOut = useCallback((e) => { e.preventDefault(); setIsDragging(false); }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer?.files?.[0];
    if (droppedFile) processFile(droppedFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) processFile(selectedFile);
  };

  const processFile = async (f) => {
    // Validate file type
    if (f.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      return;
    }

    // Validate file size (5MB)
    if (f.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }

    setError('');
    setFile(f);
    setUploading(true);

    try {
      // Upload to backend
      const response = await resumeService.uploadResume(f);
      setUploadResult(response.data.resume);

      // Auto-analyze
      setAnalyzing(true);
      try {
        await resumeService.analyzeResume(response.data.resume.id);
      } catch {
        // Analysis may fail — still show upload success
        console.warn('Auto-analysis failed, user can trigger manually');
      } finally {
        setAnalyzing(false);
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Upload failed. Please try again.';
      setError(message);
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-display-lg text-ink mb-2">Upload Your Resume</h1>
        <p className="text-body-md text-body">Upload your resume for AI-powered analysis and personalized interview preparation.</p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-600/10 text-red-500 text-body-sm flex items-center gap-2">
          <i className="bi-exclamation-triangle" />
          {error}
        </div>
      )}

      {/* Upload Zone */}
      <Card
        className={`relative transition-all duration-base ${isDragging ? 'border-ink border-2' : ''}`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center"
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-soft flex items-center justify-center"
                animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
              >
                <i className="bi-cloud-arrow-up text-3xl text-ink" />
              </motion.div>
              <h3 className="font-display text-heading-md text-ink mb-2">
                {isDragging ? 'Drop your file here' : 'Drag and drop your resume'}
              </h3>
              <p className="text-body-sm text-body mb-6">or click to browse files. Supports PDF (max 5MB)</p>

              <label>
                <input type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
                <Button as="span" variant="secondary" icon="bi-folder2-open">
                  Browse Files
                </Button>
              </label>
            </motion.div>
          ) : uploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-soft flex items-center justify-center">
                <motion.i
                  className="bi-arrow-repeat text-3xl text-ink"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                />
              </div>
              <h3 className="font-display text-heading-md text-ink mb-2">
                {analyzing ? 'Analyzing with AI...' : 'Uploading...'}
              </h3>
              <p className="text-body-sm text-body">{file.name}</p>
              <div className="max-w-xs mx-auto mt-4">
                <motion.div
                  className="h-1.5 bg-primary rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: analyzing ? '90%' : '60%' }}
                  transition={{ duration: analyzing ? 10 : 3, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="uploaded"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-600/10 flex items-center justify-center">
                <i className="bi-check-lg text-3xl text-terminal-green" />
              </div>
              <h3 className="font-display text-heading-md text-ink mb-2">Upload Complete</h3>
              <p className="text-body-sm text-body mb-6">{file.name} · {(file.size / 1024).toFixed(0)} KB</p>

              {/* PDF Preview placeholder */}
              <div className="max-w-sm mx-auto bg-surface-soft rounded-lg p-8 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <i className="bi-file-earmark-pdf text-2xl text-danger" />
                  <div className="text-left">
                    <p className="text-body-sm-strong text-ink">{file.name}</p>
                    <p className="text-caption-sm text-mute">
                      {uploadResult ? `${uploadResult.pages || 'N/A'} pages · ${uploadResult.textLength || 0} characters extracted` : 'PDF Document'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-2 bg-hairline rounded-full" style={{ width: `${70 + Math.random() * 30}%` }} />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Button onClick={() => { setFile(null); setUploadResult(null); setError(''); }} variant="secondary" icon="bi-arrow-repeat">
                  Upload Another
                </Button>
                <Button icon="bi-bar-chart-line" onClick={() => navigate('/resume/analysis')}>
                  View Analysis
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: 'bi-file-earmark-pdf', title: 'Use PDF Format', desc: 'PDF preserves formatting and is preferred by ATS systems.' },
          { icon: 'bi-type', title: 'Standard Fonts', desc: 'Stick to Arial, Calibri, or Times New Roman for best compatibility.' },
          { icon: 'bi-list-check', title: 'Clear Sections', desc: 'Use standard headers: Experience, Education, Skills, Projects.' },
        ].map((tip) => (
          <Card key={tip.title} variant="soft" compact>
            <div className="flex items-start gap-3">
              <i className={`${tip.icon} text-lg text-ink mt-0.5`} />
              <div>
                <p className="text-body-sm-strong text-ink mb-0.5">{tip.title}</p>
                <p className="text-caption-sm text-body">{tip.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResumeUploadContent;
