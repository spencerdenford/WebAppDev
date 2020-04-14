async function makePosts() {
    var jsonData = JSON.parse(this.responseText);
    console.log(jsonData);
    var hostURL = "http://localhost:3000/images/useruploads/"
    for (var i = jsonData.length - 1; i > -1; i--) {
        addPost(jsonData[i].username,
            jsonData[i].postText,
            hostURL + jsonData[i].imageURL,
            jsonData[i].time,
            jsonData[i]._id,
            jsonData[i].likes.length,
        );
    }
}

function addPost(username, postText, imageURL, postTime, postID, numLikes) {
    var post = `<div id="post">
        <image id="postpic" src="images/mandelbrot.png" height="35" />
        <div id="postname">${username}</div>
        <div id="posttime">${formatDate(postTime)}</div>
        <p id="postcontent">
            ${postText}
        </p>`

    if (imageURL != "http://localhost:3000/images/useruploads/")
        post += `<p><img class="attachedpicture" id="attachedpicture" src=${imageURL} height="200" width="200"/></p>`

    post += `
        <form method="POST">
            <input type="hidden" name="postID" id="test" value="${postID}">
            <button type="submit" formaction="/like" style="background:transparent; border:none; color:transparent;"><img src="images/heart.png" height="20"></button>
            <a class="likecount" id="likes">${numLikes}</a>
            <button type="submit" formaction="/comment" style="background:transparent; border:none; color:transparent;"><img src="images/comment.png" height="20"></button>
            <a id="comments">0</a>
        </form>
        <!--share button-->
    </div>`;
    $('#posts').append(post);
}

function formatDate(d) {
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

window.onload = function () {
    var address = window.location.href;
    username = address.substr(address.search('user=') + 5, address.length - (address.search('#user=') + 6));
    
    // find posts
    var postReq = new XMLHttpRequest();
    postReq.addEventListener("load", makePosts);
    postReq.open("GET", "/getUserPosts?user="+username);
    postReq.send();

    // set username field
    $('#username').html(username);
}
