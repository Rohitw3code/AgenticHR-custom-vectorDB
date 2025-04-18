import React from 'react';
import { FileText, Brain, Star, Mail, UserCheck, Bot, Sparkles, FileSearch } from 'lucide-react';

interface WorkflowStep {
  title: string;
  status: 'pending' | 'processing' | 'completed';
  icon: React.ReactNode;
  aiDescription?: string;
}

interface WorkflowStatusProps {
  steps: WorkflowStep[];
  selectedCount?: number;
  invitationsSent?: number;
}

function WorkflowStatus({ steps, selectedCount = 0, invitationsSent = 0 }: WorkflowStatusProps) {
  const getStepIcon = (status: string, icon: React.ReactNode) => {
    switch (status) {
      case 'processing':
        return <div className="animate-spin">{icon}</div>;
      case 'completed':
        return <div className="text-green-400">{icon}</div>;
      default:
        return <div className="text-gray-500">{icon}</div>;
    }
  };

  return (
    <div className="mt-8 p-6 bg-black/30 rounded-xl border border-purple-500/20">
      <div className="flex items-center space-x-2 mb-6">
        <Bot className="w-6 h-6 text-purple-400" />
        <h3 className="text-lg font-semibold text-purple-300">AI Selection Pipeline</h3>
      </div>
      
      <div className="relative">
        {/* Progress Lines Container */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-px">
          {/* Curved Progress Lines */}
          <svg className="w-full h-24 absolute -top-12" preserveAspectRatio="none">
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(147, 51, 234)" />
                <stop offset="100%" stopColor="rgb(79, 70, 229)" />
              </linearGradient>
            </defs>
            {steps.map((step, index) => {
              if (index < steps.length - 1) {
                const progress = step.status === 'completed' ? 100 : step.status === 'processing' ? 50 : 0;
                const startX = `${(100 / (steps.length - 1)) * index}%`;
                const endX = `${(100 / (steps.length - 1)) * (index + 1)}%`;
                
                return (
                  <path
                    key={index}
                    d={`M ${startX} 50% Q ${(parseFloat(startX) + parseFloat(endX)) / 2}% 25%, ${endX} 50%`}
                    fill="none"
                    strokeWidth="2"
                    className={`transition-all duration-300 ${
                      step.status === 'completed'
                        ? 'stroke-green-400'
                        : step.status === 'processing'
                        ? 'stroke-[url(#progressGradient)]'
                        : 'stroke-purple-900/20'
                    }`}
                    strokeDasharray={progress === 50 ? "4,4" : "none"}
                  />
                );
              }
              return null;
            })}
          </svg>
        </div>

        {/* Steps */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center group">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  step.status === 'processing'
                    ? 'bg-purple-600/50 shadow-lg shadow-purple-500/50 scale-110'
                    : step.status === 'completed'
                    ? 'bg-green-600/50 shadow-lg shadow-green-500/50'
                    : 'bg-gray-800/50'
                }`}
              >
                <div className={`transition-transform duration-500 ${
                  step.status === 'processing' ? 'scale-110' : ''
                }`}>
                  {getStepIcon(step.status, step.icon)}
                </div>
              </div>
              <span
                className={`mt-2 text-sm text-center transition-all duration-300 ${
                  step.status === 'processing'
                    ? 'text-purple-400 font-medium scale-105'
                    : step.status === 'completed'
                    ? 'text-green-400 font-medium'
                    : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
              {step.aiDescription && (
                <div 
                  className={`absolute top-full mt-2 w-48 bg-black/90 text-xs text-purple-300 p-2 rounded-lg transition-all duration-300 pointer-events-none
                    ${step.status === 'processing' 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'}`}
                >
                  <div className="flex items-center mb-1">
                    <Sparkles className="w-3 h-3 mr-1 text-purple-400" />
                    <span className="font-medium">AI Agent Task</span>
                  </div>
                  {step.aiDescription}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {(selectedCount > 0 || invitationsSent > 0) && (
        <div className="mt-8 pt-6 border-t border-purple-500/20">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/20">
              <div className="flex items-center text-sm text-purple-300">
                <UserCheck className="w-5 h-5 mr-2 text-purple-400" />
                <span>Selected: {selectedCount}</span>
              </div>
            </div>
            <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/20">
              <div className="flex items-center text-sm text-green-300">
                <Mail className="w-5 h-5 mr-2 text-green-400" />
                <span>Invited: {invitationsSent}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkflowStatus;