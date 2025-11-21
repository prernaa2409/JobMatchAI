import React, { useState } from 'react';
import { Github, AlertCircle, CheckCircle, Loader2, ExternalLink, Star } from 'lucide-react';

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  url: string;
  topics: string[];
  updatedAt: string;
}

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

export const GitHubConnect: React.FC<{
  onProjectsSelected: (projects: AnalyzedProject[]) => void;
  jobDescription: string;
}> = ({ onProjectsSelected, jobDescription }) => {
  const [step, setStep] = useState<'input' | 'loading' | 'repos' | 'analyzed'>('input');
  const [username, setUsername] = useState('');
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [analyzedProjects, setAnalyzedProjects] = useState<AnalyzedProject[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFetchRepos = async () => {
    if (!username.trim()) {
      setError('Please enter a GitHub username');
      return;
    }

    setError(null);
    setStep('loading');

    try {
      const response = await fetch('/api/github/repos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }

      const data = await response.json();
      setRepos(data.repos);
      setStep('repos');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch repositories');
      setStep('input');
    }
  };

  const handleAnalyzeProjects = async () => {
    if (!jobDescription) {
      setError('Job description is required to analyze projects');
      return;
    }

    setError(null);
    setStep('loading');

    try {
      const response = await fetch('/api/github/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze projects');
      }

      const data = await response.json();
      setAnalyzedProjects(data.matchedProjects);
      setStep('analyzed');
    } catch (err: any) {
      setError(err.message || 'Failed to analyze projects');
      setStep('repos');
    }
  };

  const handleSelectProjects = () => {
    onProjectsSelected(analyzedProjects);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20';
    if (score >= 60) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-[#00ADB5] rounded-lg">
          <Github className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#EEEEEE]">
            Connect GitHub Profile
          </h2>
          <p className="text-sm text-gray-400">
            Analyze your projects and include the best ones in your resume
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-500 font-medium">Error</p>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Step 1: Input Username */}
      {step === 'input' && (
        <div className="bg-[#393E46] rounded-lg p-6 border border-gray-700">
          <label className="block text-sm font-medium text-[#EEEEEE] mb-2">
            GitHub Username
          </label>
          <div className="flex space-x-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your GitHub username"
              className="flex-1 px-4 py-2 bg-[#222831] border border-gray-700 rounded-lg text-[#EEEEEE] placeholder-gray-500 focus:outline-none focus:border-[#00ADB5]"
              onKeyPress={(e) => e.key === 'Enter' && handleFetchRepos()}
            />
            <button
              onClick={handleFetchRepos}
              className="px-6 py-2 bg-[#00ADB5] text-white rounded-lg hover:bg-[#00ADB5]/90 transition font-medium"
            >
              Fetch Repos
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            We'll analyze your repositories to find the best matches for this job
          </p>
        </div>
      )}

      {/* Step 2: Loading */}
      {step === 'loading' && (
        <div className="bg-[#393E46] rounded-lg p-12 border border-gray-700 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-[#00ADB5] animate-spin mb-4" />
          <p className="text-[#EEEEEE] font-medium">
            {repos.length > 0 ? 'Analyzing projects...' : 'Fetching repositories...'}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            This may take a few moments
          </p>
        </div>
      )}

      {/* Step 3: Show Repos */}
      {step === 'repos' && (
        <div className="space-y-4">
          <div className="bg-[#393E46] rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[#EEEEEE] font-medium">
                  Found {repos.length} repositories
                </p>
                <p className="text-sm text-gray-400">
                  Click below to analyze them against the job description
                </p>
              </div>
              <button
                onClick={handleAnalyzeProjects}
                className="px-6 py-2 bg-[#00ADB5] text-white rounded-lg hover:bg-[#00ADB5]/90 transition font-medium"
              >
                Analyze Projects
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  className="bg-[#222831] rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-[#EEEEEE] truncate">
                      {repo.name}
                    </h3>
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <Star className="w-3 h-3" />
                      <span>{repo.stars}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                    {repo.description || 'No description'}
                  </p>
                  {repo.language && (
                    <span className="inline-block px-2 py-1 text-xs bg-[#00ADB5]/20 text-[#00ADB5] rounded">
                      {repo.language}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Analyzed Projects */}
      {step === 'analyzed' && (
        <div className="space-y-4">
          <div className="bg-green-500/10 border border-green-500 rounded-lg p-4 flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-500 font-medium">
              Analysis complete! Here are your top 3 matching projects
            </p>
          </div>

          <div className="space-y-4">
            {analyzedProjects.map((project, index) => (
              <div
                key={index}
                className="bg-[#393E46] rounded-lg p-6 border border-gray-700 hover:border-[#00ADB5] transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-[#EEEEEE]">
                        #{index + 1} {project.name}
                      </h3>
                      <div className={`px-3 py-1 rounded-full ${getScoreBgColor(project.matchScore)}`}>
                        <span className={`text-sm font-bold ${getScoreColor(project.matchScore)}`}>
                          {project.matchScore}% Match
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Tech Stack:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs bg-[#222831] text-[#00ADB5] rounded border border-gray-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-1">Why this project matches:</p>
                    <p className="text-sm text-gray-300">
                      {project.relevanceReason}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3" />
                        <span>{project.stars} stars</span>
                      </div>
                      <span>Updated: {new Date(project.lastUpdated).toLocaleDateString()}</span>
                    </div>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-xs text-[#00ADB5] hover:underline"
                    >
                      <span>View on GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between bg-[#393E46] rounded-lg p-6 border border-gray-700">
            <div>
              <p className="text-[#EEEEEE] font-medium mb-1">
                Ready to include these projects in your resume?
              </p>
              <p className="text-sm text-gray-400">
                We'll generate optimized descriptions for each project
              </p>
            </div>
            <button
              onClick={handleSelectProjects}
              className="px-6 py-3 bg-[#00ADB5] text-white rounded-lg hover:bg-[#00ADB5]/90 transition font-medium"
            >
              Use These Projects
            </button>
          </div>
        </div>
      )}
    </div>
  );
};