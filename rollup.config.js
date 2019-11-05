import vue from 'rollup-plugin-vue'
import { terser } from 'rollup-plugin-terser'
import resolve from 'rollup-plugin-node-resolve'

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.umd.min.js',
      format: 'umd',
      name: 'vueRokkaImage',
      exports: 'named',
      sourcemap: true,
    },
    plugins: [
      vue(),
      terser({
        include: [/^.+\.min\.js$/],
        sourcemap: true,
      }),
      resolve(),
    ],
  },
  {
    input: 'src/index.js',
    output: { file: 'dist/index.esm.js', format: 'es' },
    plugins: [vue(), resolve()],
  },
]
