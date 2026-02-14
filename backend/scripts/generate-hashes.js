const bcrypt = require('bcryptjs');

async function generateHashes() {
  const password = 'password123';
  
  console.log('Generating bcrypt hashes for password: "password123"\n');
  
  for (let i = 0; i < 3; i++) {
    const hash = await bcrypt.hash(password, 10);
    console.log(`Hash ${i + 1}: ${hash}`);
  }
  
  console.log('\nYou can use any of these hashes in the sample-data.sql file');
  console.log('Note: Run "npm install" in the backend directory first if you get errors.');
}

generateHashes();
