

const http = require('http');
const fs = require('fs');

const Transform = require('stream').Transform;


var totalFileSize = fs.statSync("test.iso").size


let downloaded = 0;
  var streamLogs = new Transform({
    decodeStrings: false
  });

  streamLogs._transform = function(chunk, encoding, done) {
    downloaded += chunk.length;
    console.log(`Sent file size: `,`${bytesToSize(downloaded)}/${bytesToSize(totalFileSize)}`)
    // for (const [key,value] of Object.entries(process.memoryUsage())){
    //     console.log(`Memory usage by ${key}, ${value/1000000}MB `)
    // }
    done(null, chunk);
  };


  function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i) * 1000)/1000 + ' ' + sizes[i];
 }



function sendDataFile() {
  
    const readStream = fs.createReadStream('./test.iso');
    const request = http.request('http://localhost:8000', { method: 'POST' }, (res) => console.log(`STATUS: ${res.statusCode}`));
    readStream.pipe(streamLogs).pipe(request)
    readStream.on('end', () => request.end());
    request.on('error', function(err) {
       console.log(err)
       request.end()
       process.exit(1)
    });
}

sendDataFile();
