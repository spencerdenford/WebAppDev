var hostURL = "http://localhost:3000/";
var imgURL = "http://localhost:3000/images/";
var sessionUsername;

async function reqListener(data) {
    //data = this.responseText;
    var jsonData = JSON.parse(this.responseText);
    var hostURL = "http://localhost:3000/images/useruploads/"
    console.log(jsonData);

    for(var i = jsonData.length - 1; i >= 0; i--){
        // for each post entry we add the post to the website!
        addPostToPage(
            jsonData[i].username,
            jsonData[i].postText,
            hostURL + jsonData[i].imageURL,
            jsonData[i].time,
            jsonData[i]._id,
            jsonData[i].likes,
            jsonData[i].comments,
        );
    }
}

function addPostToPage(username, postText, imageURL, postTime, postID, numLikes, comments){
    // if an image exists in the post we want to add it to the post. otherwise we want image to remain an empty string
    var image = "";
    if(imageURL != "http://localhost:3000/images/useruploads/"){
        image = `<p><img class="attachedpicture" id="attachedpicture" src=${imageURL} height="200" width="200"/></p>`;
    }

    var iLikedImg = `<img src="images/heart.png" height="20">`;
    for (i = 0; i < numLikes.length; i++){
        if(sessionUsername == numLikes[i]){
            iLikedImg = `<img src="images/hearted.png" height="20">`;
        }
    }
    
    // this big block displays the actual original post to the page
    var postHTML =  `
        <div id="post">
            <a href="/profile?user=${username}">
                <image id="postpic" src="${hostURL+"getProfilePic?user="+username}" height="35"/>
            </a>
            <a id="postname" href="/profile?user=${username}">${username}</a>
            <div id="posttime">${formatDate(postTime)}</div>
            <p id="postcontent">${postText}</p>
            <div>
                ${image}
            </div> 
            <form method="POST">
                <input type="hidden" name="postID" id="test" value="${postID}">
                <button class="likebutton" type="submit" formaction="/like" style="background:transparent; border:none; color:transparent;">
                    ${iLikedImg}
                </button>
                <a class="likecount" id="likes">${numLikes.length}</a>
                <a class="commentbutton" type="submit" style="background:transparent; border:none; color:transparent;">
                    <img src="images/comment.png" height="20">
                </a>
                <a id="comments">`;
    for(var i = 0; i < comments.length; i++){
        postHTML += `
                    <div id="comment">
                        <a href="/profile?user=${comments[i].username}">
                            <image id="postpic" src="${hostURL+"getProfilePic?user="+comments[i].username}" height="35" />
                        </a>
                        <a id="postname" href="/profile?user=${comments[i].username}">${comments[i].username}</a>
                        <div id="posttime">${formatDate(comments[i].time)}</div>
                        <p id="postcontent">Re: ${comments[i].comment}</p>
                    </div>`;
    }
    postHTML += `
                </a>
            </form>
            <!--share button-->
        </div>`;

    // add the post to the html
    $('#posts').append(postHTML);

    // first element will be the post which was just appended
    var post = $('#posts')[0].children[$('#posts')[0].children.length - 1];
    commentButton(post, postID);
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

function commentButton(post, postID){
    var commentButtonDOM = post.children[5].children[3];
    commentButtonDOM.onclick = function(){
        // add input box
        post.innerHTML +=   `
            <form id="commentwrap">
                <input id="commentmessage" type="text" name="textfield" placeholder="Type comment here:"/>
                <a id="button3">Post</a>
            </form>`;

        var commentForm = post.children[post.childElementCount - 1];
        commentForm.children[1].onclick = function() {
            var comment = commentForm.children[0].value;

            if (comment != ""){
                // erase the text box by removing its surrounding div tag
                commentForm.remove();

                // add the new comment to the html
                post.innerHTML += `
                    <div id="comment">
                        <a href="/profile?user=${sessionUsername}>
                            <image id="postpic" src="${hostURL + "getProfilePic?user=" + sessionUsername}" height="35" />
                        </a>
                        <a id="postname" href="/profile?user=${sessionUsername}">${sessionUsername}</a>
                        <div id="posttime">${formatDate(new Date())}</div>
                        <p id="postcontent">Re: ${comment}</p>
                    </div>`;

                // add the new comment to the database
                var postCommentReq = new XMLHttpRequest();
                postCommentReq.addEventListener("load", (d)=>{console.log('sent')});
                postCommentReq.open("POST", '/postComment');
                postCommentReq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                postCommentReq.send(JSON.stringify({"comment": comment, "postID": postID}));
            }

            // call commentButton again to allow multiple comments
            commentButton(post, postID);
        }
    }
}

function getUsername(data){
    // set sessionUsername to your username
    sessionUsername = data.srcElement.responseText;
    //console.log('got username: ' + sessionUsername);

    // Change the profile username to your username!
    document.getElementById("username").innerHTML = sessionUsername;
    document.getElementById("profilepicture").setAttribute("src", hostURL + "getProfilePic?user=" + sessionUsername);
    document.getElementById("composePicture").setAttribute("src", hostURL + "getProfilePic?user=" + sessionUsername);
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
}

function newsDate(d){
    // return month/day/year
    return `${d.slice(5, 7)}/${d.slice(8, 10)}/${d.slice(0, 4)}`;
}

// News Sidebar
$(document).ready(function() {
    //Retrieves the first three Canadian news article from NewsAPI.org
    $.ajax({
        method: "get",
        url: "http://newsapi.org/v2/top-headlines?country=ca&apiKey=244a29ce1f204a5da19a78c163b0c421",
        async: false,
        dataType: "json",
        success: function(data) {
            var articles = data.articles;

            // here's formatting for the news articles 
            for (var i = 0; i < 3; i++) {
                document.getElementById("newsdisplay").innerHTML += `
                <div id="article">
                    <td id="articleDetails">
                        <a id="titlewrap" href="${articles[i].url}" target="_blank">
                            <div id="articleTitle">${articles[i].title}</div>
                        </a>

                        <div id="articleSource">${articles[i].source.name}</div>
                        <div id="datePublished">Published: ${newsDate(articles[i].publishedAt)}</div>
                        
                        <img id="articleImage" src="${articles[i].urlToImage}">
                    </td>
                </div>`;
            }
        }
    })
});
