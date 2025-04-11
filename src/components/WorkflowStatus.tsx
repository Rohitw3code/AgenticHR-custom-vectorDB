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
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      default:
        return <div className="text-gray-400">{icon}</div>;
    }
  };

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">AI Selection Workflow</h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="flex items-center w-64">
              <div className="w-8 h-8 flex items-center justify-center">
                {getStepIcon(step.status, step.icon)}
              </div>
              <span className={`ml-3 ${
                step.status === 'processing' ? 'text-blue-600 font-medium' :
                step.status === 'completed' ? 'text-green-600 font-medium' :
                'text-gray-500'
              }`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className={`w-5 h-5 mx-4 ${
                step.status === 'completed' ? 'text-green-500' : 'text-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      {(selectedCount > 0 || invitationsSent > 0) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <UserCheck className="w-5 h-5 mr-2 text-blue-500" />
              <span>Selected Candidates: {selectedCount}</span>
            </div>
            <div className="flex items-center text-sm">
              <Mail className="w-5 h-5 mr-2 text-green-500" />
              <span>Invitations Sent: {invitationsSent}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkflowStatus;