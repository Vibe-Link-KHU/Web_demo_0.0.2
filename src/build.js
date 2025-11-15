#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building NUCLi OS Landing Page...\n');

try {
  // Check if node_modules exists
  if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }

  // Run the build
  console.log('🔨 Building project...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('\n✅ Build complete! Your dist folder is ready for deployment.');
  console.log('\n📁 You can now:');
  console.log('   • Drag the dist folder to netlify.com/drop');
  console.log('   • Use "netlify deploy --prod --dir=dist"');
  console.log('   • Upload to any static hosting service');

} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}