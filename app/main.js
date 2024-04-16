const net = require("net");
const fs = require("fs");
const paths = require('path');

console.log("Logs from your program will appear here!");
const args = process.argv.slice(2);

const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        const [requestLine, ...headers] = data.toString().split("\r\n");
        const [method, path] = requestLine.split(" ");

        if (path === "/") {
            socket.write("HTTP/1.1 200 OK\r\n\r\n");
        } else {
            socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        }
        socket.end();
    });

    socket.on("close", () => {
      socket.end();
    });
});

server.listen(4221, "localhost");