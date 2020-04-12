async function reqListener(data) {
    //data = this.responseText;
    var jsonData = JSON.parse(this.responseText);
    console.log(jsonData);
    var hostURL = "http://localhost:3000/images/useruploads/"
    for(var i = jsonData.length - 1; i > -1; i--){
        addPost(jsonData[i].username, jsonData[i].postText, hostURL + jsonData[i].imageURL, jsonData[i].time);
        //$('#posts').append(`<div><p>${jsonData[i].username}: </p><p>${jsonData[i].postText}</p><img src=\"${hostURL}${jsonData[i].imageURL}\"/></div>`);
    }
    //console.log(jsonData);
    //
    //console.log(hostURL + jsonData.imageURL);
    //$('#posts').append(`<div><p>${jsonData.username}: </p><p>${jsonData.text}</p><img src=\"${hostURL}${jsonData.imageURL}\"/></div>`);
}

function addPost(username, postText, imageURL, postTime){
    var post = `<div id="post">
        <image id="postpic" src="images/mandelbrot.png" height="35" />
        <div id="postname">${username}</div>
        <div id="posttime">${formatDate(postTime)}</div>
        <p id="postcontent">
            ${postText}
        </p>
        <p><img class="attachedpicture" id="attachedpicture" src=${imageURL} height="200" width="200"/></p>
        <img class="likebutton" id="likebutton" src="images/heart.png" height="20" />
        <a class="likecount" id="likes">0</a>
        <img src="images/comment.png" height="20" />
        <a id="comments">0</a>
        <!--share button-->
    </div>`;
    $('#posts').append(post);
}

function likeButton() {
    var likes = document.getElementsByClassName("likebutton");

    for (i = 0; i < likes.length; i++){
        likes[i].onclick = function() {
            //console.log(this.parentElement.children[5]);
            if (this.src == "http://localhost:3000/images/heart.png"){
                this.src = "http://localhost:3000/images/hearted.png";
                this.parentElement.children[5].innerHTML = parseInt(this.parentElement.children[5].innerHTML) + 1;
                // TODO: increment like count in database
            }
            else{
                this.src = "http://localhost:3000/images/heart.png";
                // 5 because that is the index of the "likecount" element
                this.parentElement.children[5].innerHTML = parseInt(this.parentElement.children[5].innerHTML) - 1; 
                // TODO: decrement like count in database
            }
        }
    }
}

function formatDate(d){
    var date = new Date(d);
    var dateString = "";
    if (date.getHours() == 0) {
        dateString += "12:" + (date.getMinutes()) + "am "
    }
    else if (date.getHours() < 12) {
        dateString += (date.getHours()) + ":" + (date.getMinutes()) + "am ";
    }
    else {
        dateString += (date.getHours() - 12) + ":" + (date.getMinutes()) + "pm ";
    }
    dateString += (date.getDate()) + "/" + (date.getMonth()) + "/" + (date.getFullYear());
    return dateString;
}

window.onload = function(){
    // call likeButton to add the onclick function to all the posts already on screen
    likeButton();
    
    document.getElementById("home").onclick = function (){
        console.log("Hello World");
    }

    // clear postText when user clicks into it
    var postText = document.getElementById("postText");
    postText.onclick = function(){
        postText.value = "";
    }
    
    // add new posts when the "post" button is clicked
    /*document.getElementById("button2").onclick = function(){
        if (postText.value != "") {
            var d = new Date();
            
            var posts = document.getElementById("posts");
            // TODO: add all of the new information to the post from the current user.
            posts.innerHTML =   `
                                <div id="post">
                                    <image id="postpic" src="images/mandelbrot.png" height="35" />
                                    <div id="postname">Spencer</div>
                                    <div id="posttime">${date}</div>
                                    <p id="postcontent">
                                        ${postText.value}
                                    </p>
                                    <img class="likebutton" id="likebutton" src="images/heart.png" height="20"/> 
                                    <a class="likecount" id="likes">0</a>
                                    <img src="images/comment.png" height="20"/>
                                    <a id="comments">0</a>
                                </div>
                                `
                                + posts.innerHTML;


            likeButton();
        }

        postText.value = "";
    }*/

    /*document.getElementById("button2").onclick = function(){
        console.log(postText.value);
        postText.value = "";
    }*/
    
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "/api");
    oReq.send();

    /*setInterval(function() {
        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", reqListener);
        oReq.open("GET", "/api");
        oReq.send();
    }, 3000);*/
    
    likeButton();
}
