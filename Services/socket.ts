import io from 'socket.io-client';

const socket = io('https://medplus-health.onrender.com'); // Replace with your backend URL

socket.on('slotUpdated', (data) => {
  console.log('Slot updated:', data);
  // Handle slot update logic here if needed
});

export default socket;
