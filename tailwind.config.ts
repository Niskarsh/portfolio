import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: { ubuntu: ['var(--font-ubuntu)'] },
      colors: {
        ubuntu: {
          orange: '#E95420',   // Ubuntu accent
          bg: '#0d1117',       // GitHub-dark base
          panel: '#161b22',
          border: '#30363d',
          text: '#c9d1d9',
          subtle: '#8b949e',
          hover: '#1f242d'
        }
      },
      boxShadow: { yaru: '0 16px 50px rgba(0,0,0,0.45)' }
    }
  },
  plugins: []
}

export default config
