var amqp = require('amqplib/callback_api');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
  path: '/appv2/socket.io',
});
var channel;
var q = 'frs-messaging';
var port = 9000;

http.listen(port);

app.get('/appv2', function (req, res) {
  res.sendFile(__dirname + '/appv2.html');
});

http.listen(port, function (err) {
  console.log('Express app running on port:', port);
});

amqp.connect('amqp://localhost', function (err, conn) {
  conn.createChannel(function (err, ch) {
    channel = ch;
    ch.assertQueue(q, { durable: false });

    ch.consume(q, function (msg) {

      console.log(' [x] Received \'', msg.content.toString(), '\' from ', msg.properties.appId);

      io.emit('chat message', msg.content.toString());

    }, { noAck: true });
  });
});
