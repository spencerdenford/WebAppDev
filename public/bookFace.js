async function reqListener(data) {
    //data = this.responseText;
    var jsonData = JSON.parse(this.responseText);
    console.log(jsonData);
    var hostURL = "http://localhost:3000/images/useruploads/"
    for(var i = jsonData.length - 1; i > -1; i--){
        addPost(jsonData[i].username, 
            jsonData[i].postText, 
            hostURL + jsonData[i].imageURL, 
            jsonData[i].time, 
            jsonData[i]._id,
            jsonData[i].likes.length,
        );
    }
}

function addPost(username, postText, imageURL, postTime, postID, numLikes){
    var post = `<div id="post">
        <image id="postpic" src="images/mandelbrot.png" height="35" />
        <div id="postname">${username}</div>
        <div id="posttime">${formatDate(postTime)}</div>
        <p id="postcontent">
            ${postText}
        </p>`

    if(imageURL != "http://localhost:3000/images/useruploads/")
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
    
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "/api");
    oReq.send();
    
    likeButton();
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
