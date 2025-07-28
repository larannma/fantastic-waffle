import { defineConfig } from 'vite'
import handlebars from './vite-plugin-handlebars-precompile';
import {sassPlugin} from 'esbuild-sass-plugin'

export default defineConfig({
  plugins: [
    handlebars(),
    sassPlugin(),
  ]
})