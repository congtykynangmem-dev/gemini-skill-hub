import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteSingleFile(),
    {
      name: 'post-build-process',
      closeBundle() {
        const htmlPath = path.resolve(__dirname, 'dist/index.html')
        if (fs.existsSync(htmlPath)) {
          let content = fs.readFileSync(htmlPath, 'utf8')
          
          // Trích xuất thẻ script đã inlined
          const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/)
          if (scriptMatch) {
            const scriptContent = scriptMatch[1]
            // Xóa script khỏi vị trí hiện tại (thường là trong head)
            content = content.replace(scriptMatch[0], '')
            
            // Đặt script vào cuối body (ngay trước </body>) dưới dạng script thuần túy
            const scriptTag = `<script>\n${scriptContent}\n</script>`
            content = content.replace('</body>', `${scriptTag}\n</body>`)
          }
          
          fs.writeFileSync(htmlPath, content, 'utf8')
          console.log('✓ Successfully moved inlined script to bottom of <body> for guaranteed DOM readiness!')
        }
      }
    }
  ],
})
