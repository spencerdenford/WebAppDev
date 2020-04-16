var messagehistory = [];
var messagetimes = [];
var lastmessage;

var sentMessage = [];

const socket = io();
var roomName = "";

function messagesExpand(clicked) {
    // remove the display message
    clicked.children[0].children[2].innerHTML = "";

    for (i = 0; i < messagehistory.length; i++){
        var sent = "recieved";
        for (o = 0; o < sentMessage.length; o++){
            if (messagehistory[i] == sentMessage[o]){
                sent = "sent";
            }
        }

        clicked.children[0].children[2].innerHTML += `
            <div id="senttime">${messagetimes[i]}</div>
            <div id="messagecontent" class=${sent}>${messagehistory[i]}</div>`;
    }

    // add the text field
    clicked.innerHTML += `<input type="text" name="textfield" id="sendMessage" placeholder="Type Here:" />`; 

    document.getElementById("sendMessage").onclick = function () {
        this.addEventListener("keyup", function(event) {
            // wait for the enter (13) key to be pressed!
            if ((event.keyCode === 13) && (this.value != "")) {
                // socket.io
                socket.emit('send message', {
                    room: roomName,
                    message: this.value,
                    username: null,
                });

                sentMessage.push(this.value);

                // set the box text back to null
                this.value = "";
            }
        });
    };

    // close the message history
    clicked.children[0].onclick = function () { 
        // create the display (most recent) message
        if (messagehistory.length != 0){
            var sent = "recieved";
            for (i = 0; i < sentMessage.length; i++){
                if (messagehistory[messagehistory.length - 1] == sentMessage[i]){
                    sent = "sent";
                }
            }

            this.children[2].innerHTML = `
                <div id="senttime">${messagetimes[messagehistory.length - 1]}</div>
                <div id="messagecontent" class=${sent}>${messagehistory[messagehistory.length - 1]}</div>`;
        }

        // close chat box
        if (this.parentElement.children[1] != null){
            this.parentElement.children[1].remove();
        }

        // call function so we don't mess it up by clicking the text box
        this.onclick = function () { messagesExpand(this.parentElement) };
    }
}

function formatDate(){
    // get current date and make it correct format
    var d = new Date();
    var date = "";
    var minutes = "";

    // This ensures that if the time is x:00 we display x:00 instead of just x:0
    if (d.getMinutes() < 10){
        minutes = `0${d.getMinutes()}`;
    }
    else {
        minutes = d.getMinutes();
    }

    // formatting
    if (d.getHours() == 0){ // 12am is 0
        date = `12:${minutes}am`;
    }
    else if (d.getHours() > 12){ // this is after 12pm. we dont want a 24 hour clock
        date = `${d.getHours() - 12}:${minutes}pm`;
    }
    else { // morning time :)
        date = `${d.getHours()}:${minutes}am`;
    }

    return(date);
}

window.onload = function() {var messages = document.getElementsByClassName("message");
    // give onclick function to each new "message" which is each room
    for (i = 0; i < messages.length; i++){
        messages[i].children[0].onclick = function() { messagesExpand(this.parentElement) };
    }

    var joinbutton = document.getElementById("joinRoom");
    var oldRoom = null;

    joinbutton.onclick = function(){
        // restores the message box to its original state 
        var chatBox = document.getElementById("message").children[0];
        if (chatBox.parentElement.children[1] != null){
            chatBox.parentElement.children[1].remove();
        }
        chatBox.children[2].innerHTML = "";
        chatBox.children[3].innerHTML = "Click here to send a message";
        messagehistory = [];
        messagetimes = [];

        //Displaying the chatbox for the room
        var chatBox = document.getElementById("message");
        chatBox.style.display = "block";

        //Checking if user has previously joined a room, if so, disconnect from the previous room
        if (oldRoom != null) {
            socket.emit('leave room', {
                room: oldRoom,
            });
        }

        roomName = this.parentElement.children[1].value;
        //console.log("Client - User joined room: " + roomName);

        //Changing name of room
        document.getElementById("roomName").textContent = roomName;

        //Resets room text box to nothing
        this.parentElement.children[1].value = "";

        //Joins the socket to the given room
        socket.emit('join room', {
            room: roomName,
        });

        oldRoom = roomName;
    };

    socket.on('broadcast message', function(data) {
        // this prevents the application from reading in messages from the sockets more than once
        if (data == lastmessage){
            return;
        }

        lastmessage = data;

        var sent = "recieved";
        for (i = 0; i < sentMessage.length; i++){
            if (sentMessage[i] == data.message){
                sent = "sent";
            }
        }

        // add new message and date to arrays
        messagehistory.push(data.message);
        messagetimes.push(formatDate());
        
        // shorten my statements
        var messageBox = document.getElementById("innerMessage");

        // removes the prompt message and adds the sent message to the screen
        messageBox.children[3].innerHTML = "";
        messageBox.children[2].innerHTML += `
            <div id="senttime">${messagetimes[messagehistory.length - 1]}</div>
            <div id="messagecontent" class="${sent}">${messagehistory[messagehistory.length - 1]}</div>`;

        // add the above bloacked out code IF message history is too long
        if (messagehistory.length == 10){
            // remove the oldest message (message and time)
            messageBox.children[2].children[0].remove();
            messageBox.children[2].children[0].remove();

            // this removes the oldest message from the messagehistory and messagetimes arrays
            messagehistory.shift();
            messagetimes.shift();
        }
            
    });
}
