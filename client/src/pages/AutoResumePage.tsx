import React, { useState } from 'react';
import { GitHubConnect } from '../components/GitHubConnect';
import { LearningResources } from '../components/LearningResources';
import { 
  FileText, Github, BookOpen, Wand2, Download, 
  CheckCircle, Loader2, AlertCircle, ArrowRight 
} from 'lucide-react';

interface AnalyzedProject {
  name: string;
  description: string;
  techStack: string[];
  url: string;
  matchScore: number;
  relevanceReason: string;
  stars: number;
  lastUpdated: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  title?: string;
  summary?: string;
  skills: string[];
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    responsibilities: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
  }>;
  certifications?: string[];
  githubUsername?: string;
}

export default function AutoResumePage() {
  const [step, setStep] = useState<'jd' | 'profile' | 'github' | 'resources' | 'generate' | 'complete'>('jd');
  const [jobDescription, setJobDescription] = useState('');
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({
    skills: [],
    experience: [],
    education: [],
  });
  const [selectedProjects, setSelectedProjects] = useState<AnalyzedProject[]>([]);
  const [generatedResume, setGeneratedResume] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResources, setShowResources] = useState(false);

  const handleGenerateResume = async () => {
    if (!jobDescription || !userProfile.name) {
      setError('Please complete all required fields');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Generate project descriptions if GitHub projects selected
      let enhancedProjects = selectedProjects;
      if (selectedProjects.length > 0) {
        const descriptionsResponse = await fetch('/api/github/project-descriptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projects: selectedProjects,
            jobDescription,
          }),
        });

        if (descriptionsResponse.ok) {
          const data = await descriptionsResponse.json();
          enhancedProjects = data.projectDescriptions;
        }
      }

      // Generate complete resume
      const response = await fetch('/api/resume/auto-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          jobDescription,
          githubProjects: enhancedProjects,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate resume');
      }

      const data = await response.json();
      setGeneratedResume(data.resume);
      setStep('complete');
    } catch (err: any) {
      setError(err.message || 'Failed to generate resume');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadResume = () => {
    if (!generatedResume) return;

    const blob = new Blob([generatedResume.resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${userProfile.name?.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const StepIndicator = ({ currentStep }: { currentStep: string }) => {
    const steps = [
      { id: 'jd', label: 'Job Description', icon: FileText },
      { id: 'profile', label: 'Your Profile', icon: FileText },
      { id: 'github', label: 'GitHub Projects', icon: Github },
      { id: 'generate', label: 'Generate', icon: Wand2 },
    ];

    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, index) => {
          const Icon = s.icon;
          const isActive = s.id === currentStep;
          const isComplete = steps.findIndex(st => st.id === currentStep) > index;

          return (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition ${
                    isComplete
                      ? 'bg-green-500 text-white'
                      : isActive
                      ? 'bg-[#00ADB5] text-white'
                      : 'bg-[#393E46] text-gray-400'
                  }`}
                >
                  {isComplete ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>
                <span
                  className={`text-sm font-medium ${
                    isActive ? 'text-[#00ADB5]' : isComplete ? 'text-green-500' : 'text-gray-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 rounded ${
                    isComplete ? 'bg-green-500' : 'bg-[#393E46]'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#222831] text-[#EEEEEE]">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">Auto Resume Builder</h1>
          <p className="text-gray-400 text-lg">
            Create an ATS-optimized resume tailored to your dream job
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-500 font-medium">Error</p>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Step Indicator */}
        {step !== 'complete' && <StepIndicator currentStep={step} />}

        {/* Step 1: Job Description */}
        {step === 'jd' && (
          <div className="space-y-6">
            <div className="bg-[#393E46] rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                <FileText className="w-6 h-6 text-[#00ADB5]" />
                <span>Paste Job Description</span>
              </h2>
              <p className="text-gray-400 mb-4">
                Copy and paste the full job description you're applying for
              </p>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job description here..."
                className="w-full h-64 px-4 py-3 bg-[#222831] border border-gray-700 rounded-lg text-[#EEEEEE] placeholder-gray-500 focus:outline-none focus:border-[#00ADB5] resize-none"
              />
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-400">
                  {jobDescription.length} characters
                </p>
                <button
                  onClick={() => setStep('profile')}
                  disabled={jobDescription.length < 100}
                  className="px-6 py-3 bg-[#00ADB5] text-white rounded-lg hover:bg-[#00ADB5]/90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span>Next: Your Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: User Profile */}
        {step === 'profile' && (
          <div className="space-y-6">
            <div className="bg-[#393E46] rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Your Information</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={userProfile.name || ''}
                    onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                    className="w-full px-4 py-2 bg-[#222831] border border-gray-700 rounded-lg focus:outline-none focus:border-[#00ADB5]"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    value={userProfile.email || ''}
                    onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                    className="w-full px-4 py-2 bg-[#222831] border border-gray-700 rounded-lg focus:outline-none focus:border-[#00ADB5]"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={userProfile.phone || ''}
                    onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-[#222831] border border-gray-700 rounded-lg focus:outline-none focus:border-[#00ADB5]"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value={userProfile.location || ''}
                    onChange={(e) => setUserProfile({ ...userProfile, location: e.target.value })}
                    className="w-full px-4 py-2 bg-[#222831] border border-gray-700 rounded-lg focus:outline-none focus:border-[#00ADB5]"
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Professional Title *</label>
                <input
                  type="text"
                  value={userProfile.title || ''}
                  onChange={(e) => setUserProfile({ ...userProfile, title: e.target.value })}
                  className="w-full px-4 py-2 bg-[#222831] border border-gray-700 rounded-lg focus:outline-none focus:border-[#00ADB5]"
                  placeholder="Senior Software Engineer"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Skills (comma-separated) *</label>
                <input
                  type="text"
                  value={userProfile.skills?.join(', ') || ''}
                  onChange={(e) => setUserProfile({ 
                    ...userProfile, 
                    skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full px-4 py-2 bg-[#222831] border border-gray-700 rounded-lg focus:outline-none focus:border-[#00ADB5]"
                  placeholder="React, Node.js, TypeScript, AWS, MongoDB"
                />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setStep('jd')}
                  className="px-6 py-3 bg-[#393E46] text-[#EEEEEE] rounded-lg hover:bg-[#393E46]/80 transition font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('github')}
                  disabled={!userProfile.name || !userProfile.email || !userProfile.skills?.length}
                  className="px-6 py-3 bg-[#00ADB5] text-white rounded-lg hover:bg-[#00ADB5]/90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span>Next: GitHub Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: GitHub Projects */}
        {step === 'github' && (
          <div className="space-y-6">
            <div className="bg-[#393E46] rounded-lg p-6 border border-gray-700">
              <GitHubConnect
                jobDescription={jobDescription}
                onProjectsSelected={(projects) => {
                  setSelectedProjects(projects);
                }}
              />
              
              <div className="flex justify-between mt-6 pt-6 border-t border-gray-700">
                <button
                  onClick={() => setStep('profile')}
                  className="px-6 py-3 bg-[#393E46] text-[#EEEEEE] rounded-lg hover:bg-[#393E46]/80 transition font-medium"
                >
                  Back
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep('generate')}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                  >
                    Skip GitHub
                  </button>
                  <button
                    onClick={() => setStep('generate')}
                    disabled={selectedProjects.length === 0}
                    className="px-6 py-3 bg-[#00ADB5] text-white rounded-lg hover:bg-[#00ADB5]/90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <span>Continue with {selectedProjects.length} Projects</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Generate Resume */}
        {step === 'generate' && (
          <div className="space-y-6">
            <div className="bg-[#393E46] rounded-lg p-8 border border-gray-700 text-center">
              <Wand2 className="w-16 h-16 text-[#00ADB5] mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3">Ready to Generate Your Resume</h2>
              <p className="text-gray-400 mb-6">
                We'll create an ATS-optimized resume tailored to the job description
                {selectedProjects.length > 0 && ` with your top ${selectedProjects.length} GitHub projects`}
              </p>

              <div className="bg-[#222831] rounded-lg p-4 mb-6 text-left">
                <h3 className="font-medium mb-3">What's included:</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Professional summary tailored to the role</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Skills section optimized for ATS</span>
                  </li>
                  {selectedProjects.length > 0 && (
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Top {selectedProjects.length} GitHub projects with detailed descriptions</span>
                    </li>
                  )}
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Keywords naturally incorporated from job description</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>ATS score: Expected 85+</span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowResources(!showResources)}
                  className="px-6 py-3 bg-[#393E46] text-[#EEEEEE] rounded-lg hover:bg-[#393E46]/80 transition font-medium flex items-center space-x-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{showResources ? 'Hide' : 'View'} Learning Resources</span>
                </button>
                <button
                  onClick={handleGenerateResume}
                  disabled={isGenerating}
                  className="px-8 py-3 bg-[#00ADB5] text-white rounded-lg hover:bg-[#00ADB5]/90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      <span>Generate Resume</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Learning Resources */}
            {showResources && (
              <div className="bg-[#393E46] rounded-lg p-6 border border-gray-700">
                <LearningResources 
                  jobDescription={jobDescription}
                  userSkills={userProfile.skills}
                />
              </div>
            )}
          </div>
        )}

        {/* Step 5: Complete */}
        {step === 'complete' && generatedResume && (
          <div className="space-y-6">
            <div className="bg-green-500/10 border border-green-500 rounded-lg p-6 flex items-center space-x-4">
              <CheckCircle className="w-12 h-12 text-green-500 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-green-500 mb-1">Resume Generated Successfully!</h2>
                <p className="text-gray-300">
                  Your ATS-optimized resume is ready with a score of <span className="font-bold text-[#00ADB5]">{generatedResume.atsScore}/100</span>
                </p>
              </div>
            </div>

            {/* Resume Preview */}
            <div className="bg-[#393E46] rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Your Resume</h3>
                <button
                  onClick={downloadResume}
                  className="px-4 py-2 bg-[#00ADB5] text-white rounded-lg hover:bg-[#00ADB5]/90 transition font-medium flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
              
              <div className="bg-[#222831] rounded-lg p-6 border border-gray-700 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono">
                  {generatedResume.resumeText}
                </pre>
              </div>
            </div>

            {/* Optimizations */}
            <div className="bg-[#393E46] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">Applied Optimizations</h3>
              <ul className="space-y-2">
                {generatedResume.optimizations?.map((opt: string, i: number) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{opt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Keywords */}
            <div className="bg-[#393E46] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">Incorporated Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {generatedResume.keywords?.map((keyword: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[#00ADB5]/20 text-[#00ADB5] rounded-full text-sm border border-[#00ADB5]/30"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => {
                  setStep('jd');
                  setGeneratedResume(null);
                  setSelectedProjects([]);
                  setJobDescription('');
                }}
                className="px-6 py-3 bg-[#393E46] text-[#EEEEEE] rounded-lg hover:bg-[#393E46]/80 transition font-medium"
              >
                Create Another Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}