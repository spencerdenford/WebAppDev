window.onload = function () {
    // Get username from server
    var usernameReq = new XMLHttpRequest();
    usernameReq.addEventListener("load", getUsername);
    usernameReq.open("GET", "/getUsername");
    usernameReq.send();
    console.log(usernameReq);

    function getUsername(data){
        console.log(data);
        var sessionUsername = data.srcElement.responseText;
        console.log('got username: ' + sessionUsername);
       
        //Manipulating DOM to display success message with session username
        //document.getElementById("messageSuccess").innerHTML = "Welcome back, " + sessionUsername + "! You have successfully logged in!";
    }
}