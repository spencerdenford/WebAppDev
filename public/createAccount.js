window.onload = function() {
    function getGender() {
        var gender;
        if (document.getElementById('genderRadio1').checked) {
            gender = document.getElementById('genderRadio1').value;
            console.log("User gender is: ", gender);
        }
        else if (document.getElementById('genderRadio2').checked) {
            gender = document.getElementById('genderRadio2').value;
            console.log("User gender is: ", gender);
        }
        else if (document.getElementById('genderRadio3').checked) {
            gender = document.getElementById('genderRadio3').value;
            console.log("User gender is: ", gender);
        }
        //console.log(document.getElementById('genderRadio1').value);
    }
    getGender();
}