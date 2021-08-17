export default {
  build: {
    minify: true,
    rollupOptions: {
      output: {
        entryFileNames: "dks.js",
        assetFileNames: "dks.[ext]",
      },
    },
  },
};