window.onload = function () {
    // Get username from server
    var usernameReq = new XMLHttpRequest();
    usernameReq.addEventListener("load", getUsername);
    usernameReq.open("GET", "/getUsername");
    usernameReq.send();

    function getUsername(data){
        var sessionUsername = data.srcElement.responseText;
        console.log('got username: ' + sessionUsername);
    }
}