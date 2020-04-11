function reqListener(data) {
    console.log(this.responseText);
    var jsonData = JSON.parse(this.responseText);
    console.log(jsonData);
    $('#posts').append(`<div><p>${jsonData.username}: </p><p>${jsonData.text}</p><img src=\"${jsonData.imageURL}\"/></div>`);
}

function likeButton() {
    var likes = document.getElementsByClassName("likebutton");

    for (i = 0; i < likes.length; i++){
        likes[i].onclick = function() {
            //console.log(this.parentElement.children[5]);
            if (this.src == "http://localhost:3000/images/heart.png"){
                this.src = "http://localhost:3000/images/hearted.png";
                this.parentElement.children[5].innerHTML = parseInt(document.getElementById("likes").innerHTML) + 1;
                // TODO: increment like count in database
            }
            else{
                this.src = "http://localhost:3000/images/heart.png";
                // 5 because that is the index of the "likecount" element
                this.parentElement.children[5].innerHTML = parseInt(document.getElementById("likes").innerHTML) - 1; 
                // TODO: decrement like count in database
            }
        }
    }
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
    document.getElementById("button2").onclick = function(){
        if (postText.value != "") {
            var d = new Date();
            var date = "";
            if (d.getHours() == 0){
                date += "12:" + (d.getMinutes()) + "am "
            }
            else if (d.getHours() < 12){
                date += (d.getHours()) + ":" + (d.getMinutes()) + "am ";
            }
            else {
                date += (d.getHours() - 12) + ":" + (d.getMinutes()) + "pm ";
            }
            date += (d.getDate()) + "/" + (d.getMonth()) + "/" + (d.getFullYear());
            
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
    }

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
}
