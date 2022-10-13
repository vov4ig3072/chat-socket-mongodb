import express from "express";
import { WebSocketServer } from "ws";
import path from "path";
import serverRoutes from "./routes/route.js"
import { ofline } from "./controllers/mongo.js"
const __dirname = path.resolve()

const PORT = process.env.PORT ?? 8000
const app = express()

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "static")))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(serverRoutes)

app.get("/", (req,res) => {
    res.render(`index`,{title: "Chat on WebSocket"})
})

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
    else if (inputMessage.type === "user") {
     
      console.log(`${inputMessage.text} connection`);

      server.clients.forEach((client) => {
        client.send(JSON.stringify({
            type: "online"
          })
        );
      });
    } 
    else if(inputMessage.type === "online"){
      if(inputMessage.text){
          console.log(`${inputMessage.text} diconnected`);
          ofline(inputMessage.text)
      }
      server.clients.forEach((client) => {
        client.send(JSON.stringify({
            type: "online",
            text: inputMessage.text
          })
        );
      });
    }
  });

  socket.on("close", () => {

    
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
