let socket = new WebSocket("ws://localhost:8080")

let userName = document.querySelector("#user-name")
let userNameBtn = document.querySelector("#user-name-btn")
let form = document.forms[0]
let currentUser;
  
form.addEventListener("submit", (e) => {
    e.preventDefault()
   
    if(userName.value !== ''){
        const message = JSON.stringify({
            type: "user",
            text: userName.value,
            online: true
        })
        fetch("/api/mongo",{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: message
        }).then(res =>res.json())
        .then(data => {
            if(data.exist){

                alert(data.message)


            }else{


                alert(data.message)
                


            }

            currentUser = data.name
            socket.send(message)
            console.log("client data",data)
        
        })
        // window.location = "/chat"
        userName.value = ''
    }

// users online
    fetch("/api/mongo", {method:"GET"})
    .then(res => res.json())
    .then(data =>console.log(data))
})


socket.addEventListener("close", event => {
    const message = JSON.stringify({
                type: "disc"
            })
           
            // event.preventDefault()
    
        
        socket.send(message)
        
    })
    

// const App = {
//     data() {
//       return {
//         name: ''
//       }
//     },
//     methods: {
//       async createUser() {
//         const data = {
//           name: this.name,
//           status: true
//         }
//         const res = await fetch('/api/server', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify(data)
//         })
//         // this.name = ''
//         const newServer = await res.json()
//         this.servers.push(newServer)
//       },
//       async remove(id) {
//         await fetch(`/api/server/${id}`, {method: 'DELETE'})
//         this.servers = this.servers.filter(s => s.id !== id)
//       }
//     }
//   }









// let socket = new WebSocket("ws://localhost:8000")

// let chat = document.querySelector("#chat")
// let sendMessageBtn = document.querySelector("#send")
// let inputMessage = document.querySelector(".send-message-input")
// let usersMessage = document.querySelector(".users-messages")
// let usersOnline = document.querySelector(".users-online-ul")

// let currentUser
// let users

// window.addEventListener("keypress",(event) => {
//     if(event.code === 'Enter'){
//         if(inputMessage.value !== ''){
//             const message = JSON.stringify({
//                 type: "message",
//                 text: inputMessage.value,
//                 user: currentUser
//             })
//             socket.send(message)
        
//             let div = document.createElement('div')
//             div.classList.add("message-right")
//             div.innerText = inputMessage.value
//             usersMessage.append(div)
//             inputMessage.value = ''
//         }
//     }
// })

// sendMessageBtn.addEventListener("click", (event) => {
//     const message = JSON.stringify({
//         type: "message",
//         text: inputMessage.value,
//         user: currentUser
//     })
//     socket.send(message)

//     let div = document.createElement('div')
//     div.classList.add("message-right")
//     div.innerText = inputMessage.value
//     usersMessage.append(div)
//     inputMessage.value = ''
// })

// socket.addEventListener("message", (event) => {
//     const message = JSON.parse(event.data);
//     if(message.type === "user"){
//         users = message.text
//         let child = usersOnline.firstChild;
//         while( child ) {
//             usersOnline.removeChild( child );
//             child = usersOnline.firstChild;
//         }

//         for(let client in message.text){
//             let li = document.createElement('li')
//             li.innerText = message.text[client]
//             usersOnline.append(li)
//         }
//     }
//     else if(message.type === "message"){
//         let div = document.createElement('div')
//         div.classList.add("message-left")
//         div.innerHTML = `${message.text} </br> <span class="message-from">from ${message.user}</span>`
//         usersMessage.append(div)
//     }
//     else if(message.type === "disconnect"){
//         let div = document.createElement('div')
//         div.classList.add("message-left")
//         div.innerHTML = `User "${message.text}" has left the chat`
//         usersMessage.append(div)
//     }
// })

// socket.addEventListener("close", event => {
//     const message = JSON.stringify({
//         type: "users",
//         text: users
//     })
//     socket.send(message)
    
// })
