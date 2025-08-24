import type { Plugin } from 'vite'
import Handlebars from 'handlebars'

const { precompile } = Handlebars

export default function handlebarsPrecompile(): Plugin {
  return {
    name: 'vite-plugin-handlebars-precompile',
    transform(src, id) {
      if (!id.endsWith('.hbs')) return null

      const compiled = precompile(src, { preventIndent: true })

      const code = `
        import Handlebars from 'handlebars/runtime';
        export default Handlebars.template(${compiled});
      `

      return { code, map: null }
    }
  }
}
