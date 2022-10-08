import express from "express";
import { WebSocketServer } from "ws";
import path from "path";
import serverRoutes from "./routes/route.js"
const __dirname = path.resolve()

const PORT = process.env.PORT ?? 8000
const app = express()

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname,"static")))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(serverRoutes)

app.get("/", (req,res) => {
    res.render(`index`,{title: "Login page"})
})

app.get("/chat", (req,res) => {
    res.render(`chat`, {title: "Chat page"})
})

app.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}...`);
})



let clients = {};
let currentUser;
const server = new WebSocketServer({ port: 8080 });

server.on("connection", (socket) => {
  let clientId = clientsId(clients);

  socket.on("message", (message) => {
    let inputMessage = JSON.parse(message);

    if (inputMessage.type === "message") {
      server.clients.forEach((client) => {
        if (client !== socket) {
          client.send(JSON.stringify({
              type: "message",
              user: inputMessage.user,
              text: inputMessage.text,
            })
          );
        }
      });
    } 
    else if (inputMessage.type === "user") {
      currentUser = inputMessage.text
      clients[clientId] = inputMessage.text;

      console.log(`${clients[clientId]} connection`);
      server.clients.forEach((client) => {
        client.send(JSON.stringify({
            type: "user",
            text: clients,
          })
        );
      });
    } 
    else if (inputMessage.type === "disc") {

      fetch("/api/mongo/update",{
        method:"POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: {name : currentUser}})
      server.clients.forEach((client) => {
        client.send(JSON.stringify({
            type: "user",
            text: clients,
          })
        );
      });
    }
  });

  socket.on("close", () => {
    console.log(`${clients[clientId]} diconnected`);

    server.clients.forEach((client) => {
      client.send(JSON.stringify({
          type: "disconnect",
          text: clients[clientId],
        })
      );
    });
    delete clients[clientId];

    server.clients.forEach((client) => {
      client.send(JSON.stringify({
          type: "user",
          text: clients,
        })
      );
    });
  });
});

/**
 *
 * @param {object} clients
 * @returns {number}
 */

function clientsId(clients) {
  let clientId = Math.floor(Math.random() * 1000 + 1);

  return clients[clientId] !== undefined ? clientsId(clients) : clientId;
}
