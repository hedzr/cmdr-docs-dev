export default {
  plugins: {
    '@tailwindcss/postcss': {
      // HookWebpackError: .../my-fuma/static/css/fb5ee875f83d1deb.css:2:58850: Unclosed block
      optimize: { minify: false },
    },
  },
};
