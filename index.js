import express from "express";
import { WebSocketServer } from "ws";
import path from "path";
import serverRoutes from "./routes/route.js"
import { ofline } from "./controllers/mongo.js"
const __dirname = path.resolve()

const PORT = process.env.PORT ?? 8000
const app = express()

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname,"static")))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(serverRoutes)

app.get("/", (req,res) => {
    res.render(`index`,{title: "Chat on WebSocket"})
})

// app.get("/chat", (req,res) => {
//     res.render(`chat`, {title: "Chat page"})
// })

let currentUser;
const server = new WebSocketServer({ port: 8080 });

server.on("connection", (socket) => {

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
    else if (inputMessage.type === "user" || inputMessage.type === "online") {
      currentUser = inputMessage.text
      console.log(`${currentUser} connection`);

      server.clients.forEach((client) => {
        client.send(JSON.stringify({
            type: "online"
          })
        );
      });
    } 
  });

  socket.on("close", () => {
    console.log(`${currentUser} diconnected`);

    ofline(currentUser)

    server.clients.forEach((client) => {
      client.send(JSON.stringify({
          type: "online",
        })
      );
    });
  });
});


app.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}...`);
})
