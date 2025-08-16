import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: { ubuntu: ['var(--font-ubuntu)'] },
      colors: {
        ubuntu: {
          orange:'#E95420', aubergine:'#2C001E', aubergineMid:'#5E2750', aubergineLight:'#77216F', warmGray:'#AEA79F', panel:'#0f0a10'
        }
      },
      boxShadow: { yaru: '0 10px 30px rgba(0,0,0,0.35)' }
    },
  },
  plugins: [],
}
export default config
