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
                newsDisplay += "<a href='"+articles[i].url+"' target='_blank'>";
                newsDisplay += "<div id='title'>"+articles[i].title+"</div>";
                newsDisplay += "</a>";
                newsDisplay += "<div id='source'>"+articles[i].source.name+"</div>";
                newsDisplay += "<div id='datePublished'>"+"Published: "+articles[i].publishedAt+"</div>";
                newsDisplay += "<div id='author'>"+"Author: "+articles[i].author+"</div>";
                newsDisplay += "<div id='description'>"+"Description: "+articles[i].description+"</div>";
                newsDisplay += "<div id='content'>"+"Content: "+articles[i].content+"</div>";
                newsDisplay += "</td>";
                newsDisplay += "<td id='articlePic' align='center'>";
                newsDisplay += "<img id='image' src="+articles[i].urlToImage+">";
                newsDisplay += "</td>";
                newsDisplay += "</tr>";
            }

            newsDisplay += "</table>";
            $(".newsArticles").html(newsDisplay);
        }
    })
});