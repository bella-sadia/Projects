// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import { resolve } from 'path';

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': resolve(__dirname, 'src'),
//     },
//   },
//   server: {
//     historyApiFallback: true, // Ensure all routes are handled by React
//   },
// });


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),  // Maps @ to your src directory
    },
  },
  server: {
    // Add a fallback to the index.html file
    historyApiFallback: {
      rewrites: [
        { from: /./, to: '/index.html' },  // Redirect all requests to index.html
      ],
    },
  },
});
