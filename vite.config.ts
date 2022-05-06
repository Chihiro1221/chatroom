import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { TDesignResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    AutoImport({
      resolvers: [TDesignResolver({
        library: 'vue-next',
      })],
      dts:'types/auto-imports.d.ts'
    }),
    Components({
      resolvers: [TDesignResolver({
        library: 'vue-next'
      })],
      dts:'types/vue-components.d.ts'
    }),
    vue()
  ]
})
