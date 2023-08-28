import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as mpl from 'vite-plugin-monaco-editor';

console.log(mpl)

// https://vitejs.dev/config/
export default defineConfig({
  // @ts-ignore
  plugins: [vue(), mpl.default.default({})],
})
