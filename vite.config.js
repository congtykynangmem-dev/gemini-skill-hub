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
            // Xóa script khỏi vị trí hiện tại (trong head)
            content = content.replace(scriptMatch[0], '')
            
            // Đặt script vào cuối body (ngay trước thẻ </body> CUỐI CÙNG của HTML)
            const lastBodyIdx = content.lastIndexOf('</body>')
            const scriptTag = `<script>\n${scriptContent}\n</script>`
            if (lastBodyIdx !== -1) {
              content = content.slice(0, lastBodyIdx) + scriptTag + '\n' + content.slice(lastBodyIdx)
            } else {
              content += `\n${scriptTag}`
            }
          }
          
          fs.writeFileSync(htmlPath, content, 'utf8')
          console.log('✓ Successfully moved inlined script to bottom of <body> for guaranteed DOM readiness!')
        }
      }
    }
  ],
})
