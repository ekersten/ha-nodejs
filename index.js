var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mqtt = require('mqtt');

var mqtt_client = mqtt.connect('mqtt://erickersten.com');

mqtt_client.on('connect', function() {
    mqtt_client.subscribe('ledStatus');
});

mqtt_client.on('message', function(topic, message) {
    if (topic == 'ledStatus') {
        console.log('mqtt message: ' + message);
    }
});

app.get('/', function(req, res){
    //res.send('<h1>Hello World!');
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
    socket.on('ledStatus', function(msg) {
        console.log('ledStatus: ' + msg);
        socket.broadcast.emit('ledStatusChange', msg);
        //mqtt_client.publish('ledStatus', msg);
    });
});
