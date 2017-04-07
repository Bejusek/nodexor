const cp = require('child_process');
const net = require('net');
const xorInplace = require('buffer-xor/inplace');
const util = require('util');

const key = 19;

var args = process.argv.slice(2);
var host = args[0];
var port = args[1];

console.log(`H: ${host} P: ${port}`);
var inputProcessor;

var stdin = process.stdin;
stdin.setRawMode( true );

//create socket
const connection = net.connect(port, host, () => {  
  console.log('Connected to server!');
  
  //create async stdin reader after successful connection
  inputProcessor = cp.fork('inproc', [key], {stdio: 'inherit'});
  
  //register socket data callback
  inputProcessor.on('message', (message) => {
	var keyBuffer = createKeyBuffer(message.data.length);
	xorInplace(message.data, keyBuffer);
	connection.write(new Buffer.from(message.data));
  });
});

//register child message callback
connection.on('data', (data) => {
	//prepare key buffer 
	var keyBuffer = createKeyBuffer(data.length);
	//xor incoming data
	xorInplace(data, keyBuffer);
	//write buffer to stdout
	process.stdout.write(data);
});

function createKeyBuffer(len) {
	return new Buffer(new Array(len + 1).join(key), 'hex');
}

function bufferFromArray(array) {
    return new Buffer(array);
}
