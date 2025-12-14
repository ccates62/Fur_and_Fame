#!/usr/bin/env node

const { execSync } = require('child_process');

// Get commit message from command line argument or use default
const message = process.argv[2] || 'Update';

try {
  // Check if there are any changes to commit
  let hasChanges = false;
  try {
    execSync('git diff --quiet --exit-code', { stdio: 'ignore' });
    // If we get here, there are no unstaged changes
    // Check for staged changes
    try {
      execSync('git diff --cached --quiet --exit-code', { stdio: 'ignore' });
      // No staged changes either
      hasChanges = false;
    } catch {
      // Has staged changes
      hasChanges = true;
    }
  } catch {
    // Has unstaged changes
    hasChanges = true;
  }

  if (hasChanges) {
    console.log('📦 Staging all changes...');
    execSync('git add -A', { stdio: 'inherit' });
    
    console.log(`💾 Committing with message: "${message}"`);
    execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
  } else {
    console.log('ℹ️  No changes to commit. Working tree is clean.');
  }
  
  // Check if there are commits to push
  try {
    execSync('git diff --quiet HEAD origin/main', { stdio: 'ignore' });
    console.log('ℹ️  No commits to push. Already up to date with origin/main.');
  } catch {
    console.log('🚀 Pushing to origin main...');
    execSync('git push origin main', { stdio: 'inherit' });
    console.log('✅ Successfully pushed to GitHub!');
  }
} catch (error) {
  // If the error is just "nothing to commit", that's fine
  if (error.message && error.message.includes('nothing to commit')) {
    console.log('ℹ️  No changes to commit. Working tree is clean.');
    // Still try to push in case there are commits that need pushing
    try {
      execSync('git diff --quiet HEAD origin/main', { stdio: 'ignore' });
      console.log('ℹ️  No commits to push. Already up to date with origin/main.');
    } catch {
      console.log('🚀 Pushing to origin main...');
      execSync('git push origin main', { stdio: 'inherit' });
      console.log('✅ Successfully pushed to GitHub!');
    }
  } else {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

