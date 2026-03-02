import fs from 'node:fs/promises';

const handlebarsPattern = /\{\{\s*([\w.]+)\s*\}\}/g;

export async function resolve(specifier, context, defaultResolve) {
  if (specifier.endsWith('.scss') || specifier.endsWith('.hbs')) {
    return {
      url: new URL(specifier, context.parentURL).href,
      shortCircuit: true,
    };
  }

  return defaultResolve(specifier, context, defaultResolve);
}

export async function load(url, context, defaultLoad) {
  if (url.endsWith('.scss')) {
    return {
      format: 'module',
      source: 'export default {};',
      shortCircuit: true,
    };
  }

  if (url.endsWith('.hbs')) {
    const fileContents = await fs.readFile(new URL(url), 'utf8');
    const serialized = JSON.stringify(fileContents);

    return {
      format: 'module',
      source: `
        const source = ${serialized};
        export default function template(context = {}) {
          return source.replace(${handlebarsPattern}, (_, key) => String(context[key] ?? ''));
        }
      `,
      shortCircuit: true,
    };
  }

  return defaultLoad(url, context, defaultLoad);
}
