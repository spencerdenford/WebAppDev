let socket = io();

var messagehistory = [];
var messagetimes = [];

var lastmessage;

function messagesExpand(clicked) {
    /*
    clicked.children[0].children[2].innerHTML +=    `
                                                    <div id="oldestsenttime">5:31pm</div>
                                                    <div id="messagecontent"> message history1 </div>
                                                    <div id="senttime">5:34pm</div>
                                                    <div id="messagecontent"> message history2 </div>
                                                    <div id="senttime">5:39pm</div>
                                                    <div id="messagecontent"> message history3 </div>
                                                    <div id="senttime">5:41pm</div>
                                                    <div id="messagecontent"> message history4 </div>
                                                    `; 
    */
    
    clicked.children[0].children[2].innerHTML = "";
    var timestr;

    for (i = 0; i < messagehistory.length; i++){
        if (i == 0){
            timestr = "oldestsenttime";
        }
        else {
            timestr = "senttime";
        }
        clicked.children[0].children[2].innerHTML +=    `
                                                        <div id="${timestr}">${messagetimes[i]}</div>
                                                        <div id="messagecontent">${messagehistory[i]}</div>
                                                        `;
    }

    clicked.innerHTML +=    `
                            <input type="text" name="textfield" id="sendMessage" placeholder="Type Here:" />
                            `; // this is the text field

    document.getElementById("sendMessage").onclick = function () {

        this.addEventListener("keyup", function(event) {
            // Number 13 is the "Enter" key on the keyboard
            if ((event.keyCode === 13) && (this.value != "")) {
                // socket.io
                socket.emit('send message', {
                    message: this.value,
                });

                socket.on('broadcast message', function(data) {
                    if (data == lastmessage){
                        return;
                    }

                    lastmessage = data;

                    console.log('User said: ' + data.message);
                    
                    // get current date and make it correct format
                    var d = new Date();
                    var date = "";
                    var minutes = "";

                    if (d.getMinutes() < 10){
                        minutes = `0${d.getMinutes()}`;
                    }
                    else {
                        minutes = d.getMinutes();
                    }

                    if (d.getHours() == 0){
                        date = `12:${minutes}am`;
                    }
                    else if (d.getHours() > 12){
                        date = `${d.getHours() - 12}:${minutes}pm`;
                    }
                    else {
                        date = `${d.getHours()}:${minutes}am`;
                    }

                    // add new message and date to arrays
                    messagehistory.push(data.message);
                    messagetimes.push(date);

                    /*
                    // this moves all conversation history up one
                    for (i = 1; i < 7; i += 2){
                        clicked.children[0].children[2].children[i].innerHTML = clicked.children[0].children[2].children[i + 2].innerHTML;
                        clicked.children[0].children[2].children[i - 1].innerHTML = clicked.children[0].children[2].children[i + 1].innerHTML;
                    }
                    // this is so the last non anchored message is replaces
                    clicked.children[0].children[2].children[7].innerHTML = clicked.children[0].children[4].innerHTML;
                    clicked.children[0].children[2].children[6].innerHTML = clicked.children[0].children[3].innerHTML;
                    // this replaces the last anchored message
                    // TODO save time and message to db
                    clicked.children[0].children[3].innerHTML = `${date}`;
                    clicked.children[0].children[4].innerHTML = `${this.value}`;
                    */
                    
                    // removes the prompt message and adds the sent message to the screen
                    if (messagehistory.length == 1){
                        clicked.children[0].children[3].remove();
                        clicked.children[0].children[2].innerHTML +=    `
                                                                        <div id="oldestsenttime">${messagetimes[0]}</div>
                                                                        <div id="messagecontent">${messagehistory[0]}</div>
                                                                        `;
                    }
                    else {
                        clicked.children[0].children[2].innerHTML +=    `
                                                                        <div id="senttime">${messagetimes[messagehistory.length - 1]}</div>
                                                                        <div id="messagecontent">${messagehistory[messagehistory.length - 1]}</div>
                                                                        `;
                    }

                    // add the above bloacked out code IF message history is too long
                    var oldestsenttime;
                    if (messagehistory.length == 10){
                        clicked.children[0].children[2].children[0].remove();
                        clicked.children[0].children[2].children[0].remove();

                        oldestsenttime = clicked.children[0].children[2].children[0].innerHTML;
                        
                        clicked.children[0].children[2].innerHTML = 
                            `<div id="oldestsenttime">${oldestsenttime}</div>`
                            + clicked.children[0].children[2].innerHTML;

                        clicked.children[0].children[2].children[1].remove();

                        messagehistory.shift();
                        messagetimes.shift();
                    }
                        
                });

                // set the box text back to null
                this.value = "";
            }
        });
    };

    // close the message history
    clicked.children[0].onclick = function () { 
        // create display (most recent) message
        if (messagehistory.length != 0){
            this.children[2].innerHTML =    `
                                            <div id="oldestsenttime">${messagetimes[messagehistory.length - 1]}</div>
                                            <div id="messagecontent">${messagehistory[messagehistory.length - 1]}</div>
                                            `;
        }
        // close chat box
        this.parentElement.children[1].remove();

        // call function to refresh the  
        this.onclick = function () { messagesExpand(this.parentElement) };
    }
}

window.onload = function() {
    var messages = document.getElementsByClassName("message");

    // give onclick function to each new "message" which is each room
    for (i = 0; i < messages.length; i++){
        messages[i].children[0].onclick = function() { messagesExpand(this.parentElement) };
    }

    var joinbutton = document.getElementById("joinroom");

    joinbutton.onclick = function(){
        var roomname = this.parentElement.children[1].value;
        console.log(roomname);

        // reset room text box to nothing
        this.parentElement.children[1].value = "";

        // tyler work down here vvvvvv






        
    };
}
