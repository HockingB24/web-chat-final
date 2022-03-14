window.onload = function () {

var username = prompt('What is your username?');

fetch('/messages/', {
  method: 'GET'
}).then(res => res.json())
.then(function (data) {
  //data = JSON.stringify(data);
  data.forEach(function (arrayItem) {
    //console.log(arrayItem.Body);
    socket.emit('message load', arrayItem);
  })
//console.log(JSON.stringify(data));
})

var socket = io();

var form = document.getElementById('form');
var input = document.getElementById('input');
var deleteBtn = document.getElementById('deleteAll');


form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    console.log(input.value);
    let mess = input.value;
    let message = {
      User: username,
      Body: input.value
    };
    console.log(message);
    fetch('/messages/', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    }).then(res => res.json())
    .then(data => console.log(JSON.stringify(data)));
    socket.emit('chat message', message);
    input.value = '';
  }
});

deleteBtn.addEventListener('click', function(e) {
  fetch('/messages/', {
      method: 'DELETE',
    }).then(res => res.json())
    .then((data) => {
      console.log(JSON.stringify(data));
      messages.innerHTML = '';
      socket.emit('clear messages', messages);
    });

})


socket.on('chat message', function(msg) {
  var item = document.createElement('li');
  item.textContent = msg.User + ": " + msg.Body;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('clear messages', function(msg) {
  var item = document.createElement('li');
  messages.innerHTML = '';
  item.textContent = 'CLEARED MESSAGES';
  item.style.color = "red";
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
})




};