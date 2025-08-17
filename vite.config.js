import { defineConfig } from 'vite'
import { resolve } from 'path'
import handlebarsPrecompile from './vite-plugin-handlebars-precompile'

export default defineConfig({
    build: {
        rollupOptions: {
            input: resolve(__dirname, 'index.html')
        }
    },
    plugins: [handlebarsPrecompile()]
})
