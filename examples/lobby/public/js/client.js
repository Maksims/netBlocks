// connect
var socket = io.connect(null, {
  reconnect: false
});

// when connected
socket.on('connect', function() {

  // when received lobby.join hide button and show progress bar
  socket.on('lobby.join', function(data) {
    $('#lobby > .btn').removeClass('disabled').data('state', 'leave').text('LEAVE');
    $('#lobby > .progress').fadeIn(200);
    $('#lobby > .progress > .bar').css('width', 0);
  });

  socket.on('lobby.leave', function() {
    $('#lobby > .progress').fadeOut(200);
    $('#lobby > .progress > .bar').css('width', 0);
    $('#lobby > .btn').removeClass('disabled').data('state', 'join').text('JOIN');
  });

  // when received info about players in lobby, change progress bar
  socket.on('lobby.state', function(data) {
    $('#lobby > .progress > .number').text(data.count + ' / ' + data.size);
    $('#lobby > .progress > .bar').css('width', Math.floor((data.count / data.size) * 100) + '%');
  });

  // when lobby is finished (all player ready) show start text
  socket.on('lobby.end', function(data) {
    $('#lobby > .progress > .number').fadeOut(200);
    $('#lobby > .progress').addClass('progress-success');
    $('#lobby > .ready').slideDown(200).children('.number').text(data.players);
    $('#lobby > .btn').data('state', 'refresh').text('REFRESH').addClass('btn-inverse');
  });

  // when join button is clicked, send to server 'lobby.join' messge
  $('#lobby > .btn').click(function() {
    if (!$(this).hasClass('disabled')) {
      switch($(this).data('state')) {
        case 'join':
          $(this).addClass('disabled');
          socket.emit('lobby.join');
          break;
        case 'leave':
          $(this).addClass('disabled');
          socket.emit('lobby.leave');
          break;
        case 'refresh':
          socket.disconnect();
          location.reload();
          break;
      }
    }
  });
});