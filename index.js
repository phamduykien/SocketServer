var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var client = require('socket.io-client');
var uuid = require('uuid');
var container = require('rhea');
var kafka = require('kafka-node');
var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
  });
});

http.listen(port, function () {
  console.log('listening on *:' + port);
  //subscribeMQ();
  subscribeKafka();
});

/**
 * Nghe AWS MQ de nhan message
 */
function subscribeMQ() {
  container.connect({
    host: "b-c74ec17e-9b0a-4ef4-bc91-40ef295ae9b2-1.mq.ap-southeast-1.amazonaws.com",
    port: 5671,
    username: "pdkien",
    password: "123456789",
    transport: "ssl"
  });
  container.on('connection_open', function (context) {
    var x = context;
  });

  container.on('receiver_open', function (context) {
    next_request(context);
  });
  container.on('message', function (context) {
    console.log(requests.shift() + ' => ' + context.message.body);
    if (requests.length) {
      next_request(context);
    } else {
      context.connection.close();
    }
  });

  // var conn = client.connect("wss://b-c74ec17e-9b0a-4ef4-bc91-40ef295ae9b2-1.mq.ap-southeast-1.amazonaws.com:61619");
  // conn.on('connect', function () {
  //   debugger;
  // });
  // conn.on('event', function (data) {
  //   debugger;
  // });
  // conn.on('disconnect', function () {
  //   debugger;
  // });
}

function subscribeKafka() {
  var client = new kafka.KafkaClient({
    kafkaHost: 'b-2.pdkien.xzc5lz.c4.kafka.ap-southeast-1.amazonaws.com:9094,b-1.pdkien.xzc5lz.c4.kafka.ap-southeast-1.amazonaws.com:9094,b-3.pdkien.xzc5lz.c4.kafka.ap-southeast-1.amazonaws.com:9094',
  }),
    producer = new kafka.Producer(client),
    km = new kafka.KeyedMessage('pdkien', 'test kafka'),
    payloads = [
      { topic: 'topic1', messages: 'hi', partition: 0 },
      { topic: 'topic2', messages: ['hello', 'world', km] }
    ];
  producer.on('ready', function () {
    producer.send(payloads, function (err, data) {
      console.log(data);
    });
  });
  producer.on('error', function (err) {
    var x = 1;
  })
}