async function reqListener(data) {
    //data = this.responseText;
    var jsonData = JSON.parse(this.responseText);
    console.log(jsonData);
    var hostURL = "http://localhost:3000/images/useruploads/"
    for(var i = jsonData.length - 1; i > -1; i--){
        $('#posts').append(`<div><p>${jsonData[i].username}: </p><p>${jsonData[i].postText}</p><img src=\"${hostURL}${jsonData[i].imageURL}\"/></div>`);
    }
    //console.log(jsonData);
    //
    //console.log(hostURL + jsonData.imageURL);
    //$('#posts').append(`<div><p>${jsonData.username}: </p><p>${jsonData.text}</p><img src=\"${hostURL}${jsonData.imageURL}\"/></div>`);
}

window.onload = function(){
    document.getElementById("home").onclick = function (){
        console.log("Hello World");
    }

    var postText = document.getElementById("postText");
    postText.onclick = function(){
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