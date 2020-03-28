function reqListener(data) {
    console.log(this.responseText);
    var jsonData = JSON.parse(this.responseText);
    console.log(jsonData);
    $('#posts').append(`<div><p>${jsonData.username}: </p><p>${jsonData.text}</p><img src=\"${jsonData.image}\"/></div>`);
}

window.onload = function(){
    document.getElementById("home").onclick = function (){
        console.log("Hello World");
    }

    var postText = document.getElementById("postText");
    postText.onclick = function(){
        postText.value = "";
    }

    document.getElementById("button2").onclick = function(){
        console.log(postText.value);
        postText.value = "";
    }
    
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