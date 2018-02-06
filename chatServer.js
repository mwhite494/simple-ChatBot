/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function(){// we wait until the client has loaded and contacted us that it is ready to go.

  socket.emit('answer',"Hello I am Jon Snow, a sworn brother of the Nights Watch."); //We start with the introduction;
  setTimeout(timedQuestion, 2500, socket,"What is your name?"); // Wait a moment and respond with a question.

});
  socket.on('message', (data)=>{ // If we get a new message from the client we process it;
        console.log(data);
        questionNum= bot(data,socket,questionNum);	// run the bot function with the new message
      });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data,socket,questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

/// These are the main statments that make up the conversation.
  if (questionNum == 0) {
  answer = 'Hello ' + input + '. Winter is coming.';// output response
  waitTime = 2500;
  question = 'I will test your knowledge of Westeros. What is my former house?';			    	// load next question
  }
  else if (questionNum == 1) {
    waitTime = 2500;
    if(input.toLowerCase().includes('stark')){
      answer = 'Tis true, it\'s a shame what happened to my family.';
    }
    else {
      answer = 'Fool! Who are you?! A Lannister! I owe my allegiance to House Stark!'
    }
    question = 'What is the name of my direwolf?';			    	// load next question
  }
  else if (questionNum == 2) {
    waitTime = 2500;
    if(input.toLowerCase().includes('ghost')){
      answer = 'Ghost, my good old friend. Raised him since he was a pup.';
    }
    else {
      answer = 'I should have your head on a spike! My wolf\'s name is Ghost!';
    }
    question = 'What is the real name belonging to \'The Mountain\'?';			    	// load next question
  }
  else if (questionNum == 3) {
    waitTime = 2500;
    if(input.toLowerCase().includes('gregor clegane')){
      answer = 'Yes, curse him. He is a threat as long as he is by Cersei\'s side.';
    }
    else {
      answer = 'Fool! His name is Gregor Clegane!';
    }
    question = 'Do you know the nickname given to his brother Sandor Clegane?';
  }
  else if (questionNum == 4) {
    waitTime = 2500;
    if(input.toLowerCase().includes('hound')){
      answer = 'Tis true, I fought with him beyond The Wall.';
    }
    else{
      answer = 'You bring dishonor to my house! His name was The Hound.';
    }
    question = 'Do you know the name of my mother?';
  }
  else if (questionNum == 5) {
    waitTime = 2500;
    if(input.toLowerCase().includes('lyanna')){
      answer = 'Wait... what? I never knew...';
    }
    else{
      answer = 'No that can not be! I\'m still waiting for someone to tell me...';
    }
    question = 'What is the name of my sword?';
  }
  else if (questionNum == 6) {
    waitTime = 2500;
    if(input.toLowerCase().includes('longclaw') || input.toLowerCase().includes('long claw')){
      answer = 'Yes! A great sword made from Valyrian steel.';
    }
    else{
      answer = 'Fool! The name of my sword is Longclaw.';
    }
    question = 'Will you aid me in the Great War to come?';
  }
  else {
    if(input.toLowerCase()==='yes' || input===1){
      answer = 'Good. We need ever soldier we can get. Goodbye!';
      waitTime = 0;
      question = '';
    }
    else if(input.toLowerCase()==='no' || input===0){
        answer = 'Well then you best ride south. Goodbye!'
        waitTime = 0;
        question = '';
    }else{
      answer='I did not understand you. Can you please answer with a yes or no.'
      question='Will you aid me in the Great War to come?';
      waitTime = 2000;
    }
  }


/// We take the changed data and distribute it across the required objects.
  socket.emit('answer',answer);
  setTimeout(timedQuestion, waitTime,socket,question);
  return (questionNum+1);
}

function timedQuestion(socket,question) {
  if(question!=''){
  socket.emit('question',question);
  }
  else{
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
