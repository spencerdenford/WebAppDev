$(document).ready(function() {
    //Retrieves Canadian news articles from NewsAPI.org
    $.ajax({
        method: "get",
        url: "http://newsapi.org/v2/top-headlines?country=ca&apiKey=244a29ce1f204a5da19a78c163b0c421",
        async: false,
        dataType: "json",
        success: function(data) {
            console.log(data);  //Testing
            console.log(data.articles);  //Testing
            console.log(data.articles.length); //Testing

            var articles = data.articles;
            var newsDisplay = "<table>";

            //Displaying all articles
            for (var i = 0; i < data.articles.length; i++) {
                newsDisplay += "<tr id='article'>";
                newsDisplay += "<td id='articleDetails'>";
                newsDisplay += "<div>"+"Source: "+articles[i].source.name+"</div>";
                newsDisplay += "<div>"+"Author: "+articles[i].author+"</div>";
                newsDisplay += "<div>"+"Title: "+articles[i].title+"</div>";
                newsDisplay += "<div>"+"Description: "+articles[i].description+"</div>";
                newsDisplay += "<div>"+"URL: "+articles[i].url+"</div>";
                newsDisplay += "<img id='articlePic' src="+articles[i].urlToImage+">";
                newsDisplay += "<div>"+"Published: "+articles[i].publishedAt+"</div>";
                newsDisplay += "<div>"+"Content: "+articles[i].content+"</div>";
                newsDisplay += "</tr>";
            }

            newsDisplay += "</table>";
            $(".newsArticles").html(newsDisplay);
        }
    })
});