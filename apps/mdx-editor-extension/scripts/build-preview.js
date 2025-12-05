/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const esbuild = require('esbuild');

async function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const designSrc = path.resolve(projectRoot, '../../packages/design/src');

  await esbuild.build({
    entryPoints: [path.join(projectRoot, 'media', 'preview-app', 'index.tsx')],
    outfile: path.join(projectRoot, 'dist', 'preview.js'),
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: 'es2020',
    sourcemap: true,
    jsx: 'automatic',
    define: {
      'process.env.NODE_ENV': '"development"'
    },
    alias: {
      '@': designSrc,
      '@orangec-at/design': path.join(designSrc, 'index.ts')
    },
    loader: {
      '.svg': 'dataurl'
    }
  });

  console.log('Preview bundle built at dist/preview.js');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
