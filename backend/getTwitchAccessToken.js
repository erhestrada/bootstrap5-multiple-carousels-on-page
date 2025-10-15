import axios from 'axios';
import fs from 'fs';
import path from 'path';  
import { fileURLToPath } from 'url';
import { clientId, clientSecret } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKEN_FILE = path.join(__dirname, 'token.json');

export async function getTwitchAcessToken() {
  if (fs.existsSync(TOKEN_FILE)) {
    const data = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
    if (Date.now() < data.expires_at) {
      return data.access_token;
    } else {
      console.log('⚠️ Token expired, refreshing...');
    }
  } else {
    console.log('📁 No token found, requesting...');
  }

  return await fetchNewToken();
}

async function fetchNewToken() {
  const res = await axios.post('https://id.twitch.tv/oauth2/token', null, {
    params: {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials'
    }
  });

  const tokenInfo = {
    access_token: res.data.access_token,
    expires_in: res.data.expires_in,
    expires_at: Date.now() + res.data.expires_in * 1000
  };

  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenInfo));
  console.log('✅ Got new token');
  return tokenInfo.access_token;
}

getTwitchAcessToken();
