window.startNotifications = (id) => {
    let socket = new WebSocket(`wss://${window.location.hostname}?id=${id}`);
    window.socket = socket;
    socket.onopen = () => console.log('Connected to notification server.');
    socket.onmessage = (message) => {
      message = JSON.parse(message.data);
      console.log(message);
      if (message.notification) {
        document.getElementById('notificationButton').classList.add('beep')
      }
    };
}