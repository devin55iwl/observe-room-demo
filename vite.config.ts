import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'

const assetFallbacks: Record<string, string> = {
  'fa0d16c39081a2c44765b4fd4bdd1d40747ed8e5.png':
    '/observe-room-demo/demo-assets/interviewee.jpg',
  'e38038c542ec13feb27b209f2d8ba9f865436b98.png':
    '/observe-room-demo/demo-assets/ai-moderator.jpg',
  '23ba928371385f05d2596d28574ae1b0ff2726c3.png':
    '/observe-room-demo/demo-assets/task-a.jpg',
  '74d0697514bad9978e8c7782df5125fed444578b.png':
    '/observe-room-demo/demo-assets/task-b.jpg',
  'c6fe44898bbfde63751a3f1f6653e91005096cb4.png':
    '/observe-room-demo/demo-assets/dark-bg.jpg',
}

function svgFallback(assetName: string) {
  const label = assetName.slice(0, 8)
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#171821"/>
          <stop offset="0.55" stop-color="#2b254f"/>
          <stop offset="1" stop-color="#0a0b10"/>
        </linearGradient>
        <radialGradient id="r" cx="50%" cy="38%" r="62%">
          <stop offset="0" stop-color="#615fff" stop-opacity="0.45"/>
          <stop offset="1" stop-color="#615fff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#g)"/>
      <rect width="1200" height="800" fill="url(#r)"/>
      <g fill="none" stroke="rgba(255,255,255,0.13)" stroke-width="2">
        <path d="M120 620C330 420 470 455 620 300S930 110 1080 220"/>
        <path d="M80 500C290 360 430 380 610 245s310-90 510-10"/>
      </g>
      <text x="60" y="730" fill="rgba(255,255,255,0.36)" font-family="Inter, Arial, sans-serif" font-size="42" letter-spacing="8">${label}</text>
    </svg>
  `
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function figmaAssetFallbackPlugin(): Plugin {
  return {
    name: 'figma-asset-fallback',
    enforce: 'pre',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) return `\0${id}`
      return null
    },
    load(id) {
      if (!id.startsWith('\0figma:asset/')) return null
      const assetName = id.slice('\0figma:asset/'.length)
      const url = assetFallbacks[assetName] ?? svgFallback(assetName)
      return `export default ${JSON.stringify(url)}`
    },
  }
}

export default defineConfig({
  base: '/observe-room-demo/',
  plugins: [
    figmaAssetFallbackPlugin(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
