// server/scripts/manageEnv.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Path to your .env file
const envPath = path.join(__dirname, '..', '.env');

// Function to generate a new secret
const generateSecret = () => crypto.randomBytes(64).toString('hex');

// Function to read current .env file
const readEnvFile = () => {
  try {
    return fs.readFileSync(envPath, 'utf8');
  } catch (error) {
    return '';
  }
};

// Function to parse .env content into object
const parseEnv = (content) => {
  const env = {};
  content.split('\n').forEach(line => {
    const [key, ...values] = line.split('=');
    if (key) {
      env[key.trim()] = values.join('=').trim();
    }
  });
  return env;
};

// Required environment variables with default values
const requiredEnv = {
  PORT: '5000',
  JWT_SECRET: generateSecret,
  REFRESH_TOKEN_SECRET: generateSecret
};

// Main function to manage .env
const manageEnv = () => {
  console.log('Managing environment variables...');
  
  // Read current .env
  const currentContent = readEnvFile();
  const currentEnv = parseEnv(currentContent);

  // Update with required variables
  const updatedEnv = { ...currentEnv };
  let hasChanges = false;

  Object.entries(requiredEnv).forEach(([key, defaultValue]) => {
    if (!updatedEnv[key]) {
      updatedEnv[key] = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
      hasChanges = true;
      console.log(`Generated ${key}`);
    }
  });

  if (hasChanges) {
    // Write updated .env file
    const newContent = Object.entries(updatedEnv)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    fs.writeFileSync(envPath, newContent);
    console.log('Environment variables updated successfully');
  } else {
    console.log('Environment variables are up to date');
  }
};

// Run the script
manageEnv();
