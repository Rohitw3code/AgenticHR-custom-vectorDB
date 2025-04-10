/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'cyber': {
          900: '#0A0A1B',
          800: '#12122B',
          700: '#1A1A3B',
          600: '#22224B',
          500: '#2A2A5B'
        },
        'neon': {
          blue: '#00F3FF',
          purple: '#9D00FF',
          pink: '#FF00F5'
        }
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'success': 'success 0.5s ease-in-out',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'cyber-gradient': 'cyberGradient 8s ease infinite',
        'text-shimmer': 'textShimmer 3s ease-in-out infinite alternate'
      },
      keyframes: {
        success: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' },
          '50%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 20px rgba(0, 243, 255, 0.5)'
          },
          '50%': {
            opacity: '0.8',
            boxShadow: '0 0 40px rgba(0, 243, 255, 0.8)'
          },
        },
        cyberGradient: {
          '0%, 100%': {
            backgroundPosition: '0% 50%'
          },
          '50%': {
            backgroundPosition: '100% 50%'
          }
        },
        textShimmer: {
          '0%': {
            backgroundPosition: '-200% center'
          },
          '100%': {
            backgroundPosition: '200% center'
          }
        }
      },
      scale: {
        '102': '1.02',
      },
      backgroundImage: {
        'cyber-grid': "url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%232A2A5B\" fill-opacity=\"0.1\" fill-rule=\"evenodd\"%3E%3Cpath d=\"M0 40L40 0H20L0 20M40 40V20L20 40\"%3E%3C/path%3E%3C/g%3E%3C/svg%3E')"
      }
    },
  },
  plugins: [],
};