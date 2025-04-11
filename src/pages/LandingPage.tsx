import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, UserCircle, Building2, Sparkles, Users, Bot, ArrowRight, Brain } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="w-12 h-12 text-purple-500" />,
      title: 'AI-Powered Matching',
      description: 'Advanced algorithms match candidates with the perfect job opportunities'
    },
    {
      icon: <Bot className="w-12 h-12 text-purple-400" />,
      title: 'Automated Screening',
      description: 'Intelligent resume parsing and candidate screening'
    },
    {
      icon: <Users className="w-12 h-12 text-purple-300" />,
      title: 'Smart Selection',
      description: 'Data-driven candidate selection based on match scores'
    }
  ];

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] opacity-10"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                  <span className="block text-purple-300">Welcome to</span>
                  <span className="block bg-gradient-to-r from-purple-400 to-purple-200 text-transparent bg-clip-text">
                    AgenticHR by LaperMind
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                  Revolutionizing recruitment with AI-powered candidate matching and intelligent HR automation
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
                  <div className="rounded-md shadow">
                    <button
                      onClick={() => navigate('/user')}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-black bg-purple-400 hover:bg-purple-300 md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105"
                    >
                      <UserCircle className="w-5 h-5 mr-2" />
                      Job Seeker Portal
                    </button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                      onClick={() => navigate('/admin')}
                      className="w-full flex items-center justify-center px-8 py-3 border border-purple-400 text-base font-medium rounded-md text-purple-400 bg-transparent hover:bg-purple-900/20 md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105"
                    >
                      <Building2 className="w-5 h-5 mr-2" />
                      Admin Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-black/80 backdrop-blur-lg border-t border-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-purple-300 sm:text-4xl">
              Powered by Advanced AI
            </h2>
            <p className="mt-4 text-xl text-gray-400">
              Streamline your recruitment process with our cutting-edge features
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="relative group bg-black/50 backdrop-blur-sm rounded-xl border border-purple-900/20 p-6 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl opacity-0 group-hover:opacity-20 transition-all duration-300 blur"></div>
                  <div className="relative rounded-xl p-6">
                    <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-purple-900/20 group-hover:bg-purple-900/40 transition-all duration-300">
                      {feature.icon}
                    </div>
                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-purple-300 text-center">
                        {feature.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-400 text-center">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-900/50 to-purple-800/50 mt-20 border-t border-purple-900/20">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-purple-300 sm:text-4xl">
            <span className="block">Ready to transform your hiring?</span>
            <span className="block">Start using AgenticHR today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-gray-400">
            Experience the future of recruitment with our AI-powered platform
          </p>
          <button
            onClick={() => navigate('/admin')}
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-purple-400 text-base font-medium rounded-md text-purple-400 bg-transparent hover:bg-purple-900/20 sm:w-auto transition-all duration-300 transform hover:scale-105"
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;