var sessionUsername;

async function reqListener(data) {
    //data = this.responseText;
    var jsonData = JSON.parse(this.responseText);
    var hostURL = "http://localhost:3000/images/useruploads/"

    for(var i = jsonData.length - 1; i > -1; i--){
        // for each post entry we add the post to the website!
        addPost(jsonData[i].username, 
            jsonData[i].postText, 
            hostURL + jsonData[i].imageURL, 
            jsonData[i].time, 
            jsonData[i]._id,
            jsonData[i].likes,
        );
    }
}

function addPost(username, postText, imageURL, postTime, postID, numLikes){
    // if an image exists in the post we want to add it to the post. otherwise we want image to remain an empty string
    var image = "";
    if(imageURL != "http://localhost:3000/images/useruploads/"){
        image = `<p><img class="attachedpicture" id="attachedpicture" src=${imageURL} height="200" width="200"/></p>`;
    }

    /*var iLikedImg = "";
    if(myUsername in numLikes){
        console.log("I have liked this!");
    }*/ // TODO fix this. i need to find my username

    // this big block displays the actual original post to the page
    var postHTML =  `
                <div id="post">
                    <image id="postpic" src="images/mandelbrot.png" height="35" />
                    <div id="postname">${username}</div>
                    <div id="posttime">${formatDate(postTime)}</div>
                    <p id="postcontent">${postText}</p>
                    <div>
                        ${image}
                    </div> 
                    <form method="POST">
                        <input type="hidden" name="postID" id="test" value="${postID}">
                        <button class="likebutton" type="submit" formaction="/like" style="background:transparent; border:none; color:transparent;"><img src="images/heart.png" height="20"></button>
                        <a class="likecount" id="likes">${numLikes.length}</a>
                        <a class="commentbutton" type="submit" style="background:transparent; border:none; color:transparent;">
                            <img src="images/comment.png" height="20">
                        </a>
                        <a id="comments">0</a>
                    </form>
                    <!--share button-->
                </div>
                `; // href="/comment?id=${postID}"

    // add the post to the html
    $('#posts').append(postHTML);

    // first element will be the post which was just appended
    var post = $('#posts')[0].children[$('#posts')[0].children.length - 1];
    commentButton(post);
}

function formatDate(d){
    // this function returns the post's date in a from we want to display
    var date = new Date(d);
    var dateString = "";
    var mins = "";

    // this is to ensure if it's x:00 we display x:00 instead of x:0 which is the default of getMinutes()
    if (date.getMinutes() < 10){
        mins = `0${date.getMinutes()}`;
    }
    else {
        mins = date.getMinutes();
    }

    // here we decide how to display the hour (0 is 12am and we don't want a 24 hour clock)
    if (date.getHours() == 0) {
        dateString += `12:${mins}am `;
    }
    else if (date.getHours() < 12) {
        dateString += `${date.getHours()}:${mins}am `;
    }
    else {
        dateString += `${date.getHours() - 12}:${mins}pm `;
    }

    // add the date
    dateString += `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    return dateString;
}

function likeButton() { // fix this lol
    /*
    // when each like button is clicked we increment that image's 
    if (this.src == "http://localhost:3000/images/heart.png"){
        this.src = "http://localhost:3000/images/hearted.png";
        this.parentElement.children[5].innerHTML = parseInt(this.parentElement.children[5].innerHTML) + 1;
    }
    else{
        this.src = "http://localhost:3000/images/heart.png";
        // 5 because that is the index of the "likecount" element
        this.parentElement.children[5].innerHTML = parseInt(this.parentElement.children[5].innerHTML) - 1; 
        // TODO: decrement like count in database
    }
    */
}

function commentButton(post){
    var commentButton = post.children[5].children[3];
    commentButton.onclick = function(){
        // add input box
        post.innerHTML +=   `
            <div id="commentwrap">
                <input id="commentmessage" type="text" name="textfield" placeholder="Type comment here:"/>
                <a id="postbutton">Post</a>
            </div>`;

        var comments = post.children[post.childElementCount - 1];
        comments.children[1].onclick = function() {
            var comment = comments.children[0].value;

            if (comment != ""){
                // erase the text box by removing its surrounding div tag
                comments.remove();

                // add the comment to the html
                post.innerHTML += `
                    <div id="comment">
                        <image id="postpic" src="images/mandelbrot.png" height="35" />
                        <div id="postname">${"username"}</div>
                        <div id="posttime">${formatDate(new Date())}</div>
                        <p id="postcontent">Re: ${comment}</p>
                    </div>`;
            }

            // call commentButton again to allow multiple comments
            commentButton(post);
        }
    }
}

function getUsername(data){
    var sessionUsername = data.srcElement.responseText;
    console.log('got username: ' + sessionUsername);
}

window.onload = function(){
    // Get posts from server 
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "/api");
    oReq.send();

    // Get username from server
    var usernameReq = new XMLHttpRequest();
    usernameReq.addEventListener("load", getUsername);
    usernameReq.open("GET", "/getUsername");
    usernameReq.send();
    
    // call likeButton and commentButton to add the onclick function to all the posts already on screen
    likeButton(); // <- maybe remove
}

$(document).ready(function() {
    //Retrieves the first three Canadian news article from NewsAPI.org
    $.ajax({
        method: "get",
        url: "http://newsapi.org/v2/top-headlines?country=ca&apiKey=244a29ce1f204a5da19a78c163b0c421",
        async: false,
        dataType: "json",
        success: function(data) {
            console.log(data);  //Testing
            console.log(data.articles);  //Testing

            var articles = data.articles;
            var newsDisplay = "<table>";

            for (var i = 0; i < 3; i++) {
                newsDisplay += "<tr id='article'>";
                newsDisplay += "<td id='articleDetails'>";
                newsDisplay += "<a href='"+articles[i].url+"' target='_blank'>";
                newsDisplay += "<div id='articleTitle'>"+articles[i].title+"</div>";
                newsDisplay += "</a>";
                newsDisplay += "<div id='articleSource'>"+articles[i].source.name+"</div>";
                newsDisplay += "<div id='datePublished'>"+"Published: "+articles[i].publishedAt+"</div>";
                //newsDisplay += "</td>";
                //newsDisplay += "<td id='articlePic' align='center'>";
                newsDisplay += "<img id='articleImage' src="+articles[i].urlToImage+">";
                //newsDisplay += "</td>";
                newsDisplay += "</td>";
                newsDisplay += "</tr>";
            }

            newsDisplay += "</table>";
            $(".newsArticles").html(newsDisplay);
        }
    })
});
