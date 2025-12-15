/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "rgb(var(--theme-primary) / <alpha-value>)",
        "secondary": "rgb(var(--theme-secondary) / <alpha-value>)",
        "background-light": "#FDFBF7",
        "background-dark": "rgb(var(--theme-background-dark) / <alpha-value>)",
        "surface-dark": "#1A110E",
        "text-light": "#1C1C1C",
        "text-dark": "#EAE0DC",
        "subtle-light": "#A0A0A0",
        "subtle-dark": "#6B6664"
      },
      fontFamily: {
        "display": ["Plus Jakarta Sans", "sans-serif"]
      },
      screens: {
        'xs': '480px',
        // => @media (min-width: 480px) { ... }

        'sm': '640px',
        // => @media (min-width: 640px) { ... }

        'md': '768px',
        // => @media (min-width: 768px) { ... }

        'lg': '1024px',
        // => @media (min-width: 1024px) { ... }

        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }

        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
      },  
      boxShadow: {
        'soft-glow-primary': '0 0 35px 0 rgb(var(--theme-primary) / 0.4)',
        'soft-glow-secondary': '0 0 25px 0 rgb(var(--theme-secondary) / 0.3)',
        'inner-glow': 'inset 0 2px 10px 0 rgba(255, 255, 255, 0.07)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delay-1': 'float 6s 1s ease-in-out infinite',
        'float-delay-2': 'float 6s 2s ease-in-out infinite',
        'subtle-pulse': 'subtle-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'subtle-pulse': {
          '0%, 100%': { boxShadow: '0 0 35px 0 rgb(var(--theme-primary) / 0.4)' },
          '50%': { boxShadow: '0 0 45px 5px rgb(var(--theme-primary) / 0.45)' },
        }
      },
    },
  },
  plugins: [],
}
