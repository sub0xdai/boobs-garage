const crypto = require('crypto');

// Generate secrets
const jwtSecret = crypto.randomBytes(64).toString('hex');
const refreshSecret = crypto.randomBytes(64).toString('hex');

console.log('JWT_SECRET=' + jwtSecret);
console.log('REFRESH_TOKEN_SECRET=' + refreshSecret);
