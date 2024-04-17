const net = require("net");

console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        const [requestLine, ...headers] = data.toString().split("\r\n");
        const [method, path] = requestLine.split(" ");

        if (path === "/") {
            socket.write("HTTP/1.1 200 OK\r\n\r\n");
        } else if (path.startsWith("/echo/")) {
            handleEchoRequest(path, socket);
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

function handleEchoRequest(path, socket) {
    const randomString = path.substring("/echo/".length);
    const responseBody = randomString + "\r\n";

    const contentLength = Buffer.byteLength(responseBody, 'utf8');

    const responseHeaders = [
        "HTTP/1.1 200 OK",
        "Content-Type: text/plain",
        `Content-Length: ${contentLength}`,
        "",
        responseBody
    ];

    socket.write(responseHeaders.join("\r\n"));
}

