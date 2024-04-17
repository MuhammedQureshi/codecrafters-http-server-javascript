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
        } else if (path.startsWith('/user-agent')) {
            handleAgentRequest(headers, socket)
        }
         else {
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

    // Calculate the length of the response body
    const contentLength = randomString.length;

    // Construct the response headers and body
    const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${contentLength}\r\n\r\n${randomString}\r\n`;

    // Send the response
    socket.write(response);
}

function handleAgentRequest(headers, socket) {

    let userAgent 

    for (const header of headers) {
        if (header.startsWith("User-Agent:")) {
            userAgent = header.substring("User-Agent".length).trim();
            break;
        }
    }

    const contentLength = Buffer.byteLength(userAgent, 'utf-8');

    const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${contentLength}\r\n\r\n${userAgent}\r\n`


    // Send the response
    socket.write(response);
}
