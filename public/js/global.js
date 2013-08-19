var socket = io.connect();

socket.on('connect', function() {
  console.log('connected');

  // setInterval(function() {
    socket.emit('test', { 'foo': 'bar', 'test': 1 });
  // }, 1000);
});