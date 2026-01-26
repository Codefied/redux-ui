// Bootstrap file to configure @babel/register with TypeScript support
// This file must remain as .js since it runs before Babel is configured
require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx']
});
