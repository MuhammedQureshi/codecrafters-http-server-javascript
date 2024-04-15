const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {

    socket.on("data", () => {
        socket.end("HTTP/1.1 200 OK\r\n\r\n");
        });

        socket.on("data", (data) => {
            const requestData = data.toString().split("\r\n");
            const requestPath = requestData[0].split(" ");
            if (requestPath[1] === "/") {
              socket.write("HTTP/1.1 200 OK\r\n\r\n");
            } else {
              socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
            }
            1;
        1
            socket.end();
          });

    socket.on("close", () => {
        socket.end();
        server.close();
    });
});

server.listen(4221, "localhost");
