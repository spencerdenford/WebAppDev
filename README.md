# BookFace: A Social Media Web Application

CSCI 3230U - Web Application Development: Final Project

## Getting Started

 - Clone GitHub repository to device
 * In directory:
    - npm install

### Home Page

The home page is the main feed of BookFace. You can post status updates, browse other user's posts, and even read about some news articles while on the home page. To create a post, you type in the text area anything you want, you can even upload images to go along with your posts. Your posts will be added to the home page for everyone to see. With posts, you can like and comment on them, letting others know how you feel. You also have news articles on the right hand side of the page. These are the top three stories from newsapi.org; always keeping you up to date on current affairs, even when you are not in the mood to read full articles. On the left hand side of the page, you can click on your own profile to get to your profile page.

### Profile Page

The profile page is generated using information recieved about the current user. We send the name of the user whose profile you click on to the profile page which displays all posts from that user, as well as their name and profile picture. You can interact with the posts on the profile page the same way you do in the home page. 

### Messages Page

This page implements sockets to provide BookFace members with the ability to chat amongst eachother on topics in which they share a similar interest. To begin chatting, you must first enter the name of a topic you wish to discuss. Doing so will place you in a room with other BookFace members who have also choosen the same topic. To differentiate between users, the messages you recieve from other members in the room will be displayed in a white background while the messages you send will be displayed in a light blue background. You can open and close the chat history by clicking on the message block to make your page look much more sleek.

### News Page

In this page, 20 breaking news headlines from Canada will be displayed. Every few hours or so the page will be updated with new articles.

## Authors

* **Tyler Broda**
* **Jeremy Friesen**
* **Spencer Denford**
