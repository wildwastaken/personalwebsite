import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env.local');

// Load .env.local
const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const getEnvVal = (key) => {
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].trim() : process.env[key];
};

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || getEnvVal('SPOTIFY_CLIENT_ID');
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || getEnvVal('SPOTIFY_CLIENT_SECRET');

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Error: SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET is missing from .env.local');
  process.exit(1);
}

const port = process.env.PORT || 8888;
const REDIRECT_URI = process.env.REDIRECT_URI || `http://localhost:${port}/callback`;

const SCOPES = [
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-read-playback-state'
].join(' ');

const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
  response_type: 'code',
  client_id: CLIENT_ID,
  scope: SCOPES,
  redirect_uri: REDIRECT_URI,
}).toString()}`;

console.log('\n=============================================');
console.log('🎵 SPOTIFY AUTHENTICATION SETUP');
console.log('=============================================');
console.log(`\nRedirect URI: ${REDIRECT_URI}`);
console.log('(Make sure this exact Redirect URI is added in your Spotify Developer App Settings!)\n');
console.log('1. Open this URL in your browser:\n');
console.log(authUrl);
console.log('\nWaiting for callback on port ' + port + '...\n');

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${port}`);
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const error = url.searchParams.get('error');

      if (error) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end(`<h1>Authentication Failed</h1><p>${error}</p>`);
        console.error(`\n❌ Error: ${error}`);
        process.exit(1);
      }

      if (code) {
        const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
        const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI,
          }),
        });

        const tokenData = await tokenRes.json();

        if (tokenData.refresh_token) {
          const refreshToken = tokenData.refresh_token;

          // Update .env.local
          let updatedEnv = envContent;
          if (updatedEnv.includes('SPOTIFY_REFRESH_TOKEN=')) {
            updatedEnv = updatedEnv.replace(/SPOTIFY_REFRESH_TOKEN=.*/, `SPOTIFY_REFRESH_TOKEN=${refreshToken}`);
          } else {
            updatedEnv += `\nSPOTIFY_REFRESH_TOKEN=${refreshToken}\n`;
          }
          fs.writeFileSync(envPath, updatedEnv);

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: system-ui; text-align: center; padding: 50px;">
                <h1 style="color: #1DB954;">🎉 Spotify Connected Successfully!</h1>
                <p>Your refresh token has been saved to <code>.env.local</code>.</p>
                <p>You can close this tab and return to your terminal.</p>
              </body>
            </html>
          `);

          console.log('✅ Success! New Spotify refresh token saved to .env.local:');
          console.log(refreshToken);
          server.close(() => process.exit(0));
        } else {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end(`<h1>Token Exchange Failed</h1><pre>${JSON.stringify(tokenData, null, 2)}</pre>`);
          console.error('❌ Token Exchange Failed:', tokenData);
        }
      }
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  } catch (err) {
    console.error('Callback error:', err);
    res.writeHead(500);
    res.end('Server error');
  }
});

server.listen(port);
