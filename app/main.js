const net = require("net");
const fs = require("fs");
const { argv } = require('process');
const directory = argv[argv.indexOf('--directory') + 1];

console.log("Logs from your program will appear here!");

function parseInput(data) {
    let arr = data.split('\r\n');
    return arr;
}

const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        const [requestLine, ...headers] = data.toString().split("\r\n");
        const [method, path] = requestLine.split(" ");
        let dataArr = parseInput(Buffer.from(data).toString());
        const body = dataArr[dataArr.length - 1];

        console.log(data.toString());

        if (path === "/") {
            socket.write("HTTP/1.1 200 OK\r\n\r\n");
        } else if (path.startsWith("/echo/")) {
            handleEchoRequest(path, socket);
        } else if (path.startsWith('/user-agent')) {
            handleAgentRequest(headers, socket);
        } else if (path.startsWith('/files/')) {
            let filename = path.slice(7);
            if (method === 'GET') {
                handleFileRequest(path, socket);
            } else if (method === 'POST') {
                fs.writeFileSync(`${directory}/${filename}`, body);
                socket.write('HTTP/1.1 201 OK\r\n\r\n');
            }
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

    let userAgent = "Unknown"

    for (const header of headers) {
        if (header.startsWith("User-Agent:")) {
            userAgent = header.substring("User-Agent:".length).trim();
            break;
        }
    }

    const contentLength = userAgent.length;

    console.log(userAgent);

    const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${contentLength}\r\n\r\n${userAgent}\r\n`


    // Send the response
    socket.write(response);
}


function handleFileRequest(path, socket) {
    // Extract the filename from the path
    const filename = path.substring("/files/".length);
    
    // Construct the full path to the file based on the directory provided
    const directory = process.argv[process.argv.indexOf("--directory") + 1];
    const filePath = `${directory}/${filename}`;

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        // Read the file contents
        const fileContents = fs.readFileSync(filePath);

        // Calculate the content length based on the file size
        const contentLength = fileContents.length;

        // Construct the response with application/octet-stream content type
        const response = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${contentLength}\r\n\r\n`;
        
        // Send the response headers
        socket.write(response);

        // Send the file contents as the response body
        socket.write(fileContents);
    } else {
        // If the file doesn't exist, respond with 404
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
}

// function handlePostRequest(path, data, socket) {
    


//     // Extract the filename from the path
//     let filename = path.slice(7);

//     // Construct the full path to the file based on the directory provided
//     const directory = process.argv[process.argv.indexOf("--directory") + 1];

//     fs.writeFileSync(`${directory}/${filename}`, body);

//     socket.write("HTTP/1.1 201 CREATED\r\n\r\n");

// }
