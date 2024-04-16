const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {

  socket.write('HTTP/1.1 200 OK\r\n\r\n')
  socket.on('data', (data) => {
    const request = data.toString().split('\r\n')
    const startLine = request[0].split(' ')
    const method = startLine[0]
    const url = startLine[1]
    const headers = request.slice(
      1,
      request.findIndex((line) => line === '')
    )
    console.log('Method:', method)
    console.log('URL:', url)
    console.log('Headers:', headers)
    if (url === '/') {
      socket.write('HTTP/1.1 200 OK\r\n\r\n')
      console.log('200')
    } else {
      socket.write('HTTP/1.1 404 Not Found\r\n\r\n')
      console.log('404')
    }
1
  })


    socket.on("close", () => {
        socket.end();
        server.close();
    });
});

server.listen(4221, "localhost");
