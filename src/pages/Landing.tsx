import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Briefcase, Users, Target, Award, ArrowRight, Sparkles, Bot, Cpu, Network } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-cyber-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-cyber-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-900/90 to-cyber-800/90" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-cyber-700/50 border border-neon-blue/20 animate-pulse-glow">
                    <Sparkles className="h-4 w-4 text-neon-blue" />
                    <span className="text-sm font-medium text-neon-blue">AI-Powered Job Matching</span>
                  </div>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                    <span className="block bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
                      Future of
                    </span>
                    <span className="block mt-2">Job Recruitment</span>
                  </h1>
                  <p className="mt-6 text-xl text-gray-300 leading-relaxed max-w-2xl">
                    Experience the next generation of job matching powered by advanced AI. Our platform analyzes your skills, experience, and preferences to find your perfect career match with unprecedented accuracy.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/user-login"
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium overflow-hidden rounded-xl bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,243,255,0.4)]"
                  >
                    <span className="relative flex items-center">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                  <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl border-2 border-neon-blue/30 hover:border-neon-blue/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,243,255,0.2)]">
                    Learn More
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-cyber-700">
                  {[
                    { label: 'Active Users', value: '10K+' },
                    { label: 'Job Matches', value: '50K+' },
                    { label: 'Success Rate', value: '95%' },
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-neon-blue">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 via-neon-purple/20 to-neon-pink/20 rounded-3xl blur-3xl animate-pulse-glow" />
                <div className="relative bg-cyber-700/50 rounded-3xl p-8 backdrop-blur-xl border border-white/10">
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      {
                        icon: Bot,
                        title: 'AI Analysis',
                        description: 'Smart profile analysis',
                      },
                      {
                        icon: Cpu,
                        title: 'ML Matching',
                        description: 'Precise job matching',
                      },
                      {
                        icon: Network,
                        title: 'Neural Networks',
                        description: 'Deep learning powered',
                      },
                      {
                        icon: Brain,
                        title: 'Smart Insights',
                        description: 'Career path guidance',
                      },
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className="group p-4 rounded-xl bg-cyber-600/50 hover:bg-cyber-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,243,255,0.1)]"
                      >
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div className="p-3 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-purple/20">
                            <feature.icon className="h-6 w-6 text-neon-blue group-hover:text-neon-purple transition-colors duration-300" />
                          </div>
                          <h3 className="text-sm font-semibold">{feature.title}</h3>
                          <p className="text-xs text-gray-400">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-cyber-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                Powered by Advanced AI
              </span>
            </h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              Our cutting-edge technology ensures the perfect match between candidates and opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Brain,
                title: 'AI-Powered Matching',
                description: 'Advanced algorithms analyze profiles for perfect job matches',
              },
              {
                icon: Briefcase,
                title: 'Smart Opportunities',
                description: 'Curated job listings based on your unique profile',
              },
              {
                icon: Users,
                title: 'Intelligent Screening',
                description: 'Automated skill assessment and candidate ranking',
              },
              {
                icon: Target,
                title: 'Career Insights',
                description: 'Data-driven career path recommendations',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl bg-cyber-700/50 hover:bg-cyber-600/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,243,255,0.2)]"
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300" />
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-lg bg-cyber-600 group-hover:bg-cyber-500 transition-colors duration-300">
                    <feature.icon className="h-6 w-6 text-neon-blue group-hover:text-neon-purple transition-colors duration-300" />
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;