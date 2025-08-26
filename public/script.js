const socket = io();
const qrImg = document.getElementById('qr');
const status = document.getElementById('status');
const form = document.getElementById('form');
const output = document.getElementById('output');

socket.on('qr', src => {
  qrImg.src = src;
  status.innerText = 'Scan QR to login';
});

socket.on('ready', () => status.innerText = 'WhatsApp is ready!');
socket.on('authenticated', () => status.innerText = 'Authenticated');
socket.on('auth_failure', msg => status.innerText = `Auth failure: ${msg}`);
socket.on('disconnected', () => status.innerText = 'Disconnected');

form.addEventListener('submit', async e => {
  e.preventDefault();
  status.innerText = 'Uploading...';

  const formData = new FormData(form);
  const res = await fetch('/api/add-members', {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  status.innerText = 'Process Complete';
  output.innerText = JSON.stringify(data, null, 2);
});
