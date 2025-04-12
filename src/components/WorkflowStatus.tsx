import React from 'react';
import { Timer, CheckCircle2, ArrowRight, Mail, FileText, Brain, Star, UserCheck } from 'lucide-react';

interface WorkflowStep {
  title: string;
  status: 'pending' | 'processing' | 'completed';
  icon: React.ReactNode;
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
        return <CheckCircle2 className="w-6 h-6 text-green-400" />;
      default:
        return <div className="text-gray-500">{icon}</div>;
    }
  };

  return (
    <div className="mt-8 p-6 bg-black/30 rounded-xl border border-purple-500/20">
      <h3 className="text-lg font-semibold mb-6 text-purple-300">AI Selection Pipeline</h3>
      <div className="relative">
        <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-purple-600/20 transform -translate-y-1/2" />
        <div className="relative z-10 flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step.status === 'processing'
                    ? 'bg-purple-600/50 shadow-lg shadow-purple-500/50'
                    : step.status === 'completed'
                    ? 'bg-green-600/50 shadow-lg shadow-green-500/50'
                    : 'bg-gray-800/50'
                }`}
              >
                {getStepIcon(step.status, step.icon)}
              </div>
              <span
                className={`mt-2 text-sm text-center w-24 ${
                  step.status === 'processing'
                    ? 'text-purple-400 font-medium'
                    : step.status === 'completed'
                    ? 'text-green-400 font-medium'
                    : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
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