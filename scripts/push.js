#!/usr/bin/env node

const { execSync } = require('child_process');

// Get commit message from command line argument or use default
const message = process.argv[2] || 'Update';

try {
  console.log('📦 Staging all changes...');
  execSync('git add -A', { stdio: 'inherit' });
  
  console.log(`💾 Committing with message: "${message}"`);
  execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
  
  console.log('🚀 Pushing to origin main...');
  execSync('git push origin main', { stdio: 'inherit' });
  
  console.log('✅ Successfully pushed to GitHub!');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

