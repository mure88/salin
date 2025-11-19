#!/usr/bin/env node

/**
 * Netlify Deployment Script for Salin App
 * 
 * This script helps prepare and deploy the app to Netlify
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Salin App - Netlify Deployment Helper\n');

// Check if netlify CLI is installed
function checkNetlifyCLI() {
  try {
    execSync('netlify --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Step 1: Check prerequisites
console.log('📋 Step 1: Checking prerequisites...');

if (!checkNetlifyCLI()) {
  console.log('❌ Netlify CLI not found!');
  console.log('   Install it with: npm install -g netlify-cli');
  console.log('   Then run this script again.\n');
  process.exit(1);
}

console.log('✅ Netlify CLI installed\n');

// Step 2: Check for PostgreSQL schema
console.log('📋 Step 2: Checking database configuration...');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const schemaContent = fs.readFileSync(schemaPath, 'utf8');

if (schemaContent.includes('provider = "sqlite"')) {
  console.log('⚠️  Warning: Your schema is still using SQLite!');
  console.log('   For Netlify deployment, you need PostgreSQL.');
  console.log('   Follow these steps:');
  console.log('   1. Set up a Supabase account (free): https://supabase.com');
  console.log('   2. Create a new project and get the connection string');
  console.log('   3. Update prisma/schema.prisma to use PostgreSQL');
  console.log('   4. Run: npx prisma db push');
  console.log('   5. Run: npm run db:seed\n');
  
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question('Have you completed the database setup? (yes/no): ', (answer) => {
    readline.close();
    if (answer.toLowerCase() !== 'yes') {
      console.log('\n📖 Please complete the database setup first.');
      console.log('   See NETLIFY_DEPLOYMENT.md for detailed instructions.\n');
      process.exit(0);
    }
    continueDeployment();
  });
} else {
  console.log('✅ PostgreSQL configuration detected\n');
  continueDeployment();
}

function continueDeployment() {
  // Step 3: Check environment variables
  console.log('📋 Step 3: Environment variables check...');
  console.log('   Make sure you have set these in Netlify:');
  console.log('   - DATABASE_URL (PostgreSQL connection string)');
  console.log('   - JWT_SECRET (random secret key)');
  console.log('   - NEXT_PUBLIC_APP_NAME (optional)');
  console.log('   - NODE_ENV=production\n');

  // Step 4: Build test
  console.log('📋 Step 4: Testing build...');
  try {
    console.log('   Running: npm run build');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build successful!\n');
  } catch (error) {
    console.log('❌ Build failed! Fix errors before deploying.\n');
    process.exit(1);
  }

  // Step 5: Deploy options
  console.log('📋 Step 5: Ready to deploy!\n');
  console.log('Choose deployment method:');
  console.log('1. Deploy via CLI (recommended for first time)');
  console.log('2. Connect to Git and auto-deploy (recommended for ongoing)');
  console.log('3. Manual deploy\n');

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readline.question('Enter choice (1-3): ', (choice) => {
    readline.close();

    switch (choice) {
      case '1':
        console.log('\n🚀 Deploying via Netlify CLI...\n');
        console.log('Run these commands:');
        console.log('1. netlify login');
        console.log('2. netlify init');
        console.log('3. netlify env:set DATABASE_URL "your-connection-string"');
        console.log('4. netlify env:set JWT_SECRET "your-secret"');
        console.log('5. netlify deploy --prod\n');
        break;

      case '2':
        console.log('\n🔗 Setting up Git deployment...\n');
        console.log('1. Push your code to GitHub/GitLab/Bitbucket');
        console.log('2. Go to https://app.netlify.com');
        console.log('3. Click "Add new site" → "Import an existing project"');
        console.log('4. Connect your repository');
        console.log('5. Set environment variables in Site settings');
        console.log('6. Deploy!\n');
        break;

      case '3':
        console.log('\n📦 Manual deployment...\n');
        console.log('Run: netlify deploy --prod\n');
        break;

      default:
        console.log('\n❌ Invalid choice. Please run the script again.\n');
    }
  });
}
