
function messagesExpand(clicked) {
    clicked.children[0].children[2].innerHTML +=    `
                                                    <div id="messagecontent"> message history1 </div>
                                                    <div id="messagecontent"> message history2 </div>
                                                    <div id="messagecontent"> message history3 </div>
                                                    <div id="messagecontent"> message history4 </div>
                                                    `; 

    clicked.innerHTML +=    `
                            <input type="text" name="textfield" id="sendMessage" placeholder="Type Here:" />
                            `;

    document.getElementById("sendMessage").onclick = function () {
        this.addEventListener("keyup", function(event) {
            // Number 13 is the "Enter" key on the keyboard
            if ((event.keyCode === 13) && (this.value != "")) {
                // this moves all conversation history up one
                for (i = 0; i < 3; i++){
                    clicked.children[0].children[2].children[i].innerHTML = clicked.children[0].children[2].children[i + 1].innerHTML;
                }
                // this is so the last non anchored message is replaces
                clicked.children[0].children[2].children[3].innerHTML = clicked.children[0].children[4].innerHTML;
                // this replaces the last anchored message
                clicked.children[0].children[4].innerHTML = `${this.value}`;

                this.value = "";
            }
        });
    };

    clicked.children[0].onclick = function () {
        this.children[2].innerHTML = "";
        this.parentElement.children[1].remove();

        this.onclick = function () { messagesExpand(this.parentElement) };
    }
}

window.onload = function() {
    var messages = document.getElementsByClassName("message");

    for (i = 0; i < messages.length; i++){
        messages[i].children[0].onclick = function() { messagesExpand(this.parentElement) };
    }
}