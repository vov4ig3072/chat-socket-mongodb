let socket = new WebSocket("ws://localhost:8080")

let loginConteiner = document.querySelector(".form-center")
let userName = document.querySelector("#user-name")
let form = document.forms[0]

let modal = new bootstrap.Modal(document.querySelector('#modalConfirm'));
let alarmText = document.querySelector(".alarm-text")
let btnModal = document.querySelector(".btn-secondary")

let chatConteiner = document.querySelector("#chat")
let listUsers = document.querySelector(".list-group")

let messageSendBtn = document.querySelector("#button-addon2")
let messageSendInput = document.querySelector("#input-message")
let containerMessages = document.querySelector(".users-message")
let currentUser;

btnModal.addEventListener('click', () => modal.hide())
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
        })
        .then(res =>res.json())
        .then(data => {
            if(!data.online){
                currentUser = userName.value
                socket.send(message)
                loginConteiner.classList.add("hide")
                chatConteiner.classList.add("chat")
                chatConteiner.classList.remove("hide")
               
            }else{
                alarmText.innerText = data.message
                modal.show()
            }
        })
        userName.value = ''
    }
})

socket.addEventListener("message", event => {
    const message = JSON.parse(event.data)
    if(message.type === "online"){
        fetch("/api/mongo", {method:"GET"})
        .then(res => res.json())
        .then(data =>{
            
            while(listUsers.firstChild){
                listUsers.firstChild.remove()
            }
            data.forEach(elem => {
                let li = document.createElement('li')
                li.classList.add("list-group-item")
                li.innerText = elem.name
                listUsers.append(li)
            })
        })
    }else if(message.type === "message"){
        let div = document.createElement('div')
        div.classList.add("message-left")
        div.innerHTML = `${message.text} </br> <span class="message-from">from ${message.user}</span>`
        containerMessages.append(div)
    }
})

messageSendBtn.addEventListener("click", () => {
    if(messageSendInput.value !== ""){
        const message = JSON.stringify({
            type: "message",
            user: currentUser,
            text: messageSendInput.value
        })
        socket.send(message)
        let div = document.createElement('div')
        div.classList.add("message-right")
        div.innerText = messageSendInput.value
        containerMessages.append(div)
        messageSendInput.value = ''
    }
})

socket.addEventListener("close", event => {
        const message = JSON.stringify({
                type: "online",
                text: currentUser
            })
        socket.send(message)

        fetch("/api/mongo/disc",{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: message
        })
    })
