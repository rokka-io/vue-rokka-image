import vue from 'rollup-plugin-vue'
import { terser } from "rollup-plugin-terser"

export default {
    input: 'src/index.js',
    output: [
      {file: 'dist/index.esm.js', format: 'es'},
      {file: 'dist/index.esm.min.js', format: 'es', sourcemap: true},
    ],
    plugins: [
      vue(),
      terser({
        include: [/^.+\.min\.js$/],
        sourcemap: true
      })
    ],
    external: ['vue-runtime-helpers']
  }
