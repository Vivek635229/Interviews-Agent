import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ProgressRing from '../../components/data-display/ProgressRing';
import ProgressBar from '../../components/data-display/ProgressBar';
import ScrollReveal from '../../components/animations/ScrollReveal';
import resumeService from '../../services/resumeService';
import { ROUTES } from '../../constants/routes';

/**
 * ResumeAnalysisContent — ATS score, skills analysis, improvement suggestions from real data.
 */
const ResumeAnalysisContent = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        // Get user's resumes
        const response = await resumeService.getUserResumes();
        const resumes = response.data?.resumes || [];

        if (resumes.length === 0) {
          setError('no_resume');
          setLoading(false);
          return;
        }

        // Get the latest resume with full details
        const latestId = resumes[0]._id;
        const fullResponse = await resumeService.getResume(latestId);
        const resumeData = fullResponse.data?.resume;

        if (!resumeData?.isAnalyzed) {
          // Trigger analysis if not done yet
          try {
            const analysisResponse = await resumeService.analyzeResume(latestId);
            setResume(analysisResponse.data?.resume);
          } catch {
            setResume(resumeData);
          }
        } else {
          setResume(resumeData);
        }
      } catch (err) {
      // console.error removed for production
        setError('Failed to load resume analysis.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-8 w-64 bg-surface-soft rounded-lg animate-pulse mb-2" />
          <div className="h-5 w-96 bg-surface-soft rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-surface-soft rounded-xl animate-pulse" />
          <div className="h-64 bg-surface-soft rounded-xl animate-pulse lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (error === 'no_resume') {
    return (
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h1 className="font-display text-display-lg text-ink mb-2">Resume Analysis</h1>
          <p className="text-body-md text-body">Upload a resume first to see your analysis.</p>
        </motion.div>
        <Card className="py-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-soft flex items-center justify-center">
            <i className="bi-file-earmark-arrow-up text-3xl text-mute" />
          </div>
          <h3 className="font-display text-heading-md text-ink mb-2">No Resume Uploaded</h3>
          <p className="text-body-sm text-body mb-6">Upload your resume to get an AI-powered ATS analysis.</p>
          <Link to={ROUTES.RESUME_UPLOAD}>
            <Button icon="bi-cloud-arrow-up">Upload Resume</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-600/10 text-red-500 text-body-sm">{error}</div>
    );
  }

  const atsScore = resume?.atsScore || 0;
  const skills = resume?.skills || [];
  const missingSkills = resume?.missingSkills || [];
  const improvements = resume?.improvements || [];
  const scoreBreakdown = resume?.scoreBreakdown || [];
  const fileName = resume?.originalName || resume?.fileName || 'Resume';

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="font-display text-display-lg text-ink mb-2">Resume Analysis</h1>
        <p className="text-body-md text-body">Detailed analysis of <span className="text-ink font-medium">{fileName}</span></p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ATS Score */}
        <ScrollReveal>
          <Card className="text-center py-8">
            <h2 className="text-body-sm-strong text-ink mb-4">ATS Compatibility Score</h2>
            <ProgressRing value={atsScore} size={160} strokeWidth={10} />
            <p className="text-body-sm text-body mt-4">
              {atsScore >= 80 ? 'Your resume is well-optimized for Applicant Tracking Systems' :
               atsScore >= 60 ? 'Your resume could use some improvements for ATS compatibility' :
               'Your resume needs significant improvements for ATS compatibility'}
            </p>
          </Card>
        </ScrollReveal>

        {/* Score Breakdown */}
        <ScrollReveal delay={0.1} className="lg:col-span-2">
          <Card>
            <h2 className="font-display text-heading-md text-ink mb-6">Score Breakdown</h2>
            {scoreBreakdown.length > 0 ? (
              <div className="space-y-4">
                {scoreBreakdown.map((item) => (
                  <ProgressBar key={item.label} label={item.label} value={item.score} height={8} />
                ))}
              </div>
            ) : (
              <p className="text-body-sm text-mute text-center py-8">Score breakdown not available.</p>
            )}
          </Card>
        </ScrollReveal>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Found */}
        <ScrollReveal>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-heading-md text-ink">Skills Detected</h2>
              <Badge>{skills.length} found</Badge>
            </div>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill.name}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-body-sm ${skill.strength === 'strong' ? 'bg-green-600/10 text-green-500' : 'bg-surface-soft text-ink'}`}
                  >
                    {skill.strength === 'strong' && <i className="bi-check-circle-fill text-xs" />}
                    {skill.name}
                    <span className="text-caption-sm text-mute">×{skill.mentions}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-body-sm text-mute text-center py-8">No skills detected yet.</p>
            )}
          </Card>
        </ScrollReveal>

        {/* Missing Skills */}
        <ScrollReveal delay={0.1}>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-heading-md text-ink">Missing Skills</h2>
              <Badge variant="warning">{missingSkills.length} suggested</Badge>
            </div>
            {missingSkills.length > 0 ? (
              <div className="space-y-3">
                {missingSkills.map((skill) => (
                  <div key={skill.name} className="flex items-start gap-3 p-3 rounded-lg bg-surface-soft">
                    <i className="bi-plus-circle text-lg text-ink mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-body-sm-strong text-ink">{skill.name}</p>
                        <Badge size="sm" variant={skill.importance === 'high' ? 'danger' : 'warning'}>{skill.importance}</Badge>
                      </div>
                      <p className="text-caption-sm text-body">{skill.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-body-sm text-mute text-center py-8">No missing skills identified.</p>
            )}
          </Card>
        </ScrollReveal>
      </div>

      {/* Improvement Suggestions */}
      {improvements.length > 0 && (
        <ScrollReveal>
          <Card>
            <h2 className="font-display text-heading-md text-ink mb-6">Improvement Suggestions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {improvements.map((item, i) => (
                <div key={item.title || i} className="flex items-start gap-3 p-4 rounded-lg border border-hairline">
                  <div className="w-10 h-10 rounded-full bg-surface-soft flex items-center justify-center flex-shrink-0">
                    <i className={`${item.icon || 'bi-lightbulb'} text-lg text-ink`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-body-sm-strong text-ink">{item.title}</p>
                      <Badge size="sm" variant={item.priority === 'high' ? 'danger' : item.priority === 'medium' ? 'warning' : 'default'}>
                        {item.priority}
                      </Badge>
                    </div>
                    <p className="text-caption-sm text-body">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </ScrollReveal>
      )}
    </div>
  );
};

export default ResumeAnalysisContent;
