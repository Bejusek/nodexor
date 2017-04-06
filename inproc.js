var fs = require('fs');
var BUFSIZE = 625;
var buf = new Buffer(BUFSIZE);
var bytesRead;

while (true) {
    bytesRead = 0;
    try {
        bytesRead = fs.readSync(process.stdin.fd, buf, 0, BUFSIZE);
    } catch (ex) {       
        if (ex.code === 'EOF') {            
            break;          
        }
		
		// unexpected exception
        throw ex;
    }
    if (bytesRead === 0) {
        // No more stdin input available        
        break;
    }
	
	// Process the chunk read.
	console.log('Bytes read: %s; content:%s', bytesRead, buf.toString(null, 0, bytesRead));
	
	// Send read content as message to parent	
	process.send(buf.slice(0, bytesRead));
}