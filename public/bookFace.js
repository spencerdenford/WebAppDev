async function reqListener(data) {
    //data = this.responseText;
    var jsonData = JSON.parse(this.responseText);
    console.log(jsonData);
    var hostURL = "http://localhost:3000/images/useruploads/"
    for(var i = jsonData.length - 1; i > -1; i--){
        addPost(jsonData[i].username, jsonData[i].postText, hostURL + jsonData[i].imageURL, jsonData[i].time);
    }
}

function addPost(username, postText, imageURL, postTime){
    var post = `<div id="post">
        <image id="postpic" src="images/mandelbrot.png" height="35" />
        <div id="postname">${username}</div>
        <div id="posttime">${formatDate(postTime)}</div>
        <p id="postcontent">
            ${postText}
        </p>`

    if(imageURL != "http://localhost:3000/images/useruploads/")
        post += `<p><img class="attachedpicture" id="attachedpicture" src=${imageURL} height="200" width="200"/></p>`

    post += `<img class="likebutton" id="likebutton" src="images/heart.png" height="20" />
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
    
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "/api");
    oReq.send();
    
    likeButton();
}

$(document).ready(function() {
    //Retrieves the first Canadian news article from NewsAPI.org
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

            newsDisplay += "<tr id='article'>";
            newsDisplay += "<td id='articleDetails'>";
            newsDisplay += "<a href='"+articles[0].url+"' target='_blank'>";
            newsDisplay += "<div id='articleTitle'>"+articles[0].title+"</div>";
            newsDisplay += "</a>";
            newsDisplay += "<div id='articleSource'>"+articles[0].source.name+"</div>";
            newsDisplay += "<div id='datePublished'>"+"Published: "+articles[0].publishedAt+"</div>";
            //newsDisplay += "</td>";
            //newsDisplay += "<td id='articlePic' align='center'>";
            newsDisplay += "<img id='articleImage' src="+articles[0].urlToImage+">";
            //newsDisplay += "</td>";
            newsDisplay += "</td>";
            newsDisplay += "</tr>";

            newsDisplay += "</table>";
            $(".newsArticles").html(newsDisplay);
        }
    })
});
