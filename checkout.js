var amqp = require('amqplib/callback_api');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
  path: '/checkout/socket.io',
});
var channel;
var q = 'frs-messaging';
var port = 9090;

app.get('/checkout', function (req, res) {
  res.sendFile(__dirname + '/checkout.html');
});

io.on('connection', function (socket) {
  channel.assertQueue(q, { durable: false });

  socket.on('chat message', function (msg) {
    console.log('Sending ', msg, ' to queue.');
    channel.sendToQueue(q, Buffer.from(msg), {
      appId: 'checkout',
    });
  });
});

http.listen(port, function (err) {
  console.log('Express app running on port:', port);
});

amqp.connect('amqp://localhost', function (err, conn) {
  conn.createChannel(function (err, ch) {
    channel = ch;
    ch.assertQueue(q, { durable: false });
  });
});
