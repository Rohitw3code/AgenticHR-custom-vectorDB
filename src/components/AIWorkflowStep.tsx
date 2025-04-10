import React from 'react';
import { CheckCircle } from 'lucide-react';

interface AIWorkflowStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed';
  isLast?: boolean;
}

const AIWorkflowStep: React.FC<AIWorkflowStepProps> = ({
  icon,
  title,
  description,
  status,
  isLast = false,
}) => {
  return (
    <div className="flex items-center relative">
      <div className="relative flex flex-col items-center">
        {/* Neural Network Connection Line */}
        {!isLast && (
          <div
            className={`absolute top-8 left-full w-full h-0.5 transform transition-all duration-500 ease-in-out ${
              status === 'completed'
                ? 'bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink animate-pulse-glow'
                : status === 'processing'
                ? 'bg-gradient-to-r from-neon-blue to-neon-purple animate-cyber-gradient'
                : 'bg-gray-200 dark:bg-cyber-600'
            }`}
          >
            {/* Neural Network Nodes */}
            <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-neon-blue animate-pulse-glow" />
            <div className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-neon-purple animate-pulse-glow delay-100" />
            <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-neon-pink animate-pulse-glow delay-200" />
          </div>
        )}

        {/* Icon Container */}
        <div
          className={`relative w-20 h-20 rounded-2xl flex items-center justify-center transform transition-all duration-500 ease-in-out ${
            status === 'processing'
              ? 'bg-gradient-to-br from-neon-blue via-neon-purple to-neon-pink text-white scale-110 animate-pulse-glow'
              : status === 'completed'
              ? 'bg-gradient-to-br from-neon-blue to-neon-purple text-white scale-105'
              : 'bg-cyber-700 text-gray-400'
          }`}
        >
          {/* Glowing Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
          
          {/* Processing Animation */}
          {status === 'processing' && (
            <div className="absolute inset-0 rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink opacity-20 animate-spin-slow" />
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink opacity-20 animate-spin-slow delay-300" style={{ animationDirection: 'reverse' }} />
            </div>
          )}
          
          {/* Icon */}
          <div className={`relative z-10 transform transition-transform duration-300 ${
            status === 'processing' ? 'animate-float' : ''
          }`}>
            {icon}
          </div>
        </div>

        {/* Title and Description */}
        <div className="mt-4 text-center">
          <h4 className={`text-sm font-semibold ${
            status === 'processing'
              ? 'bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent animate-text-shimmer'
              : status === 'completed'
              ? 'text-neon-blue'
              : 'text-gray-900 dark:text-gray-300'
          }`}>
            {title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[150px] mt-1">{description}</p>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2">
        {status === 'processing' && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple blur-md animate-pulse-glow" />
            <div className="relative animate-spin-slow rounded-full h-6 w-6 border-4 border-neon-blue border-t-transparent shadow-[0_0_15px_rgba(0,243,255,0.5)]" />
          </div>
        )}
        {status === 'completed' && (
          <CheckCircle className="h-6 w-6 text-neon-blue transform scale-110 transition-all duration-300 animate-success shadow-[0_0_15px_rgba(0,243,255,0.5)]" />
        )}
      </div>
    </div>
  );
};

export default AIWorkflowStep;