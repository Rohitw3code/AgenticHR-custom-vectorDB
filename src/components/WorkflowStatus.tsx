import React from 'react';
import { Timer, CheckCircle2, ArrowRight } from 'lucide-react';

interface WorkflowStep {
  title: string;
  status: 'pending' | 'processing' | 'completed';
}

interface WorkflowStatusProps {
  steps: WorkflowStep[];
}

function WorkflowStatus({ steps }: WorkflowStatusProps) {
  const getStepIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Timer className="w-6 h-6 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      default:
        return <div className="w-6 h-6 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">AI Selection Workflow</h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="flex items-center w-64">
              {getStepIcon(step.status)}
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
    </div>
  );
}

export default WorkflowStatus;