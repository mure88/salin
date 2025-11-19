const { NodeSSH } = require('node-ssh');
const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: '.env.deploy' });

const ssh = new NodeSSH();

const config = {
  host: process.env.DEPLOY_HOST || '31.217.196.220',
  port: process.env.DEPLOY_PORT || 22,
  username: process.env.DEPLOY_USERNAME || 'utancuom',
  privateKeyPath: process.env.DEPLOY_KEY_PATH || 'C:\\Users\\murat.salin\\.ssh\\cpanel_deploy',
  remotePath: process.env.DEPLOY_REMOTE_PATH || '/home5/utancuom/public_html/salin',
};

const localBuildPath = path.join(__dirname, '.next');
const localPublicPath = path.join(__dirname, 'public');
const localPackageJson = path.join(__dirname, 'package.json');
const localPackageLock = path.join(__dirname, 'package-lock.json');

async function deploy() {
  try {
    console.log('🚀 Starting deployment to cPanel...\n');

    // Connect to server
    console.log(`📡 Connecting to ${config.host}...`);
    await ssh.connect({
      host: config.host,
      port: config.port,
      username: config.username,
      privateKey: fs.readFileSync(config.privateKeyPath, 'utf8'),
    });
    console.log('✅ Connected successfully!\n');

    // Create backup
    console.log('💾 Creating backup...');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `/home5/${config.username}/backups/salin_${timestamp}`;
    
    await ssh.execCommand(`mkdir -p /home5/${config.username}/backups`);
    const backupResult = await ssh.execCommand(
      `if [ -d "${config.remotePath}" ]; then cp -r ${config.remotePath} ${backupPath}; echo "Backup created"; else echo "No existing deployment"; fi`
    );
    console.log(backupResult.stdout || backupResult.stderr);

    // Create remote directory if it doesn't exist
    console.log('\n📁 Preparing remote directory...');
    await ssh.execCommand(`mkdir -p ${config.remotePath}`);

    // Upload .next build
    console.log('\n📤 Uploading build files...');
    await ssh.putDirectory(localBuildPath, `${config.remotePath}/.next`, {
      recursive: true,
      concurrency: 10,
      validate: (itemPath) => {
        const basename = path.basename(itemPath);
        return basename !== 'cache' && !basename.startsWith('.');
      },
    });
    console.log('✅ Build files uploaded');

    // Upload public folder
    console.log('\n📤 Uploading public assets...');
    if (fs.existsSync(localPublicPath)) {
      await ssh.putDirectory(localPublicPath, `${config.remotePath}/public`, {
        recursive: true,
        concurrency: 10,
      });
      console.log('✅ Public assets uploaded');
    }

    // Upload package files
    console.log('\n📤 Uploading package files...');
    await ssh.putFile(localPackageJson, `${config.remotePath}/package.json`);
    await ssh.putFile(localPackageLock, `${config.remotePath}/package-lock.json`);
    console.log('✅ Package files uploaded');

    // Install production dependencies
    console.log('\n📦 Installing production dependencies...');
    const installResult = await ssh.execCommand(
      'npm ci --production',
      { cwd: config.remotePath }
    );
    console.log(installResult.stdout || installResult.stderr);

    // Run Prisma generate
    console.log('\n🔧 Generating Prisma Client...');
    const prismaResult = await ssh.execCommand(
      'npx prisma generate',
      { cwd: config.remotePath }
    );
    console.log(prismaResult.stdout || prismaResult.stderr);

    // Set permissions
    console.log('\n🔒 Setting permissions...');
    await ssh.execCommand(`chmod -R 755 ${config.remotePath}`);
    console.log('✅ Permissions set');

    // Restart Node.js app (if using cPanel Node.js app)
    console.log('\n🔄 Restarting application...');
    const restartResult = await ssh.execCommand(
      `touch ${config.remotePath}/tmp/restart.txt`
    );
    console.log('✅ Application restart triggered');

    console.log('\n✨ Deployment completed successfully!');
    console.log(`\n📍 Your app should be available at: https://kohtaanto.fi/salin`);
    console.log(`\n⚠️  Remember to:`);
    console.log(`   1. Set up environment variables in cPanel`);
    console.log(`   2. Configure MySQL database connection`);
    console.log(`   3. Run database migrations if needed`);
    console.log(`   4. Test the application\n`);

  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  } finally {
    ssh.dispose();
  }
}

// Run deployment
deploy();
