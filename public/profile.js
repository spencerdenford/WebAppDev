var hostURL = "http://localhost:3000/";
var imgURL = "http://localhost:3000/images/";
var sessionUsername;

async function makePosts() {
    var jsonData = JSON.parse(this.responseText);
    console.log(jsonData);
    for (var i = jsonData.length - 1; i > -1; i--) {
        addPost(jsonData[i].username,
            jsonData[i].postText,
            jsonData[i].imageURL,
            jsonData[i].time,
            jsonData[i]._id,
            jsonData[i].likes.length,
        );
    }
}

function addPost(username, postText, imageName,  postTime, postID, numLikes) {
    console.log(hostURL + "getProfilePic?user=" + username);
    var post = `<div id="post">
        <image id="postpic" src="${hostURL+"getProfilePic?user="+username}" height="35"/>
        <div id="postname">${username}</div>
        <div id="posttime">${formatDate(postTime)}</div>
        <p id="postcontent">
            ${postText}
        </p>`

    if (imageName != "" && imageName != undefined)
        post += `<p><img class="attachedpicture" id="attachedpicture" src=${imgURL + "useruploads/" + imageName} height="200" width="200"/></p>`

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

function getUsername(data) {
    sessionUsername = data.srcElement.responseText;
    console.log('got username: ' + sessionUsername);

    if(username == sessionUsername){
        console.log("username == sessionUsername");
        var pageheader = document.getElementById('pageheader');
        pageheader.innerHTML += `<form method="POST" action="changeProfilePic" id="profilePicForm" enctype="multipart/form-data">
            <input type="hidden" name="username" id="test" value="${sessionUsername}">
            <input id="fileimage" type="file" name="newProfilePic"/>
        </form>`;
    
        document.getElementById("fileimage").onchange = function () {
            console.log('submit form');
            document.getElementById("profilePicForm").submit();
        };
    }
}



window.onload = function () {
    var address = window.location.href;
    username = address.substr(address.search('user=') + 5, address.length - (address.search('#user=') + 6));

    // Get username from server
    var usernameReq = new XMLHttpRequest();
    usernameReq.addEventListener("load", getUsername);
    usernameReq.open("GET", "/getUsername");
    usernameReq.send();
    
    // find posts
    var postReq = new XMLHttpRequest();
    postReq.addEventListener("load", makePosts);
    postReq.open("GET", "/getUserPosts?user="+username);
    postReq.send();

    // set profilePic
    var profilePic = document.getElementById('profilepicture');
    profilePic.setAttribute("src", hostURL + "getProfilePic?user=" + username);

    // set username field
    $('#username').html(username);
}
