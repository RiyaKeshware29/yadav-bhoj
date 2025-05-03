importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyBOJWe8jU3RfoqZPuoHvB5ZJeaeQCzMOgU",
  authDomain: "fir-food-project-6fb6e.firebaseapp.com",
  projectId: "fir-food-project-6fb6e",
  storageBucket: "fir-food-project-6fb6e.firebasestorage.app",
  messagingSenderId: "617071619767",
  appId: "1:617071619767:web:4b379e0aa27030586a2732"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message', payload);

  const notificationTitle = payload.data.title || 'New Notification';
  const notificationOptions = {
    body: payload.data.body,
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});




