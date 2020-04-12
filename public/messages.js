
function messagesExpand(clicked) {
    clicked.children[0].children[2].innerHTML +=    `
                                                    <div id="oldestsenttime">5:31pm</div>
                                                    <div id="messagecontent"> message history1 </div>
                                                    <div id="senttime">5:34pm</div>
                                                    <div id="messagecontent"> message history2 </div>
                                                    <div id="senttime">5:39pm</div>
                                                    <div id="messagecontent"> message history3 </div>
                                                    <div id="senttime">5:41pm</div>
                                                    <div id="messagecontent"> message history4 </div>
                                                    `; // TODO: replace this with actual message history

    clicked.innerHTML +=    `
                            <input type="text" name="textfield" id="sendMessage" placeholder="Type Here:" />
                            `;

    document.getElementById("sendMessage").onclick = function () {
        this.addEventListener("keyup", function(event) {
            // Number 13 is the "Enter" key on the keyboard
            if ((event.keyCode === 13) && (this.value != "")) {
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
                    date = `${d.getHours()}:${minutes}pm`;
                }
                else {
                    date = `${d.getHours()}:${minutes}am`;
                }

                // TODO: remove oldest message from db
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
