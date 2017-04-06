var cp = require('child_process');

if (!process.send) {
  var p = cp.fork(__dirname + '/fork_test');
  p.send({
    count: 10
  });
  p.on('message', function(data) {
    console.log(data);
    process.exit(0);
  });
} else {
  process.on('message', function(data) {
    console.log(`${process.pid}: ${data.count}`);
    
	data.count--;
    if (data.count === 0) {
      process.send('exit');
      process.exit(0);
    }
	
    var p = cp.fork(__dirname + '/fork_test');
	console.log(`Send ${process.pid} -> ${p.pid} : ${data.count}`)
    p.send(data);
    p.on('message', function(data) {
	  //console.log(`Send2 ${process.pid} -> ${p.pid} : ${data.count}`)
      process.send(data);
      //process.exit(0);
    });
  });
}