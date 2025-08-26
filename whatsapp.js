const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: './session' }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', async qr => {
  const img = await qrcode.toDataURL(qr);
  global.io.emit('qr', img);
});

client.on('ready', () => global.io.emit('ready'));
client.on('authenticated', () => global.io.emit('authenticated'));
client.on('auth_failure', msg => global.io.emit('auth_failure', msg));
client.on('disconnected', () => {
  global.io.emit('disconnected');
  client.initialize();
});

client.initialize();
module.exports = client;
