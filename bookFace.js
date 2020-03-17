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
}