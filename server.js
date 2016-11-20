var express = require("express");
var app = express();
var http = require("http");
var server = http.Server(app);
var socketio = require("socket.io");
var io = socketio(server);
app.use(express.static("pub"));

var field = [];
var allSockets = [];
var players =[];

io.on("connection", function(socket) {
	console.log("Somebody connected:)");
	
	
	socket.on("disconnect", function() {
		console.log("diconnect :("); 
		var indexOfUser = allSockets.indexOf(socket);
		allSockets.splice(indexOfUser, 1);
		players.splice(indexOfUser, 1);
		io.emit("wait", "Your letter is " + players[indexOfUser] +". Wait for another Player")
	});
	
	socket.on("UserConnected", function(nothing) {
	if(allSockets.length < 2)
	{
		allSockets.push(socket);
		players.push(getEmptyLetter());
		if(allSockets.length == 1)
		{
				socket.emit("wait", "Your letter is " + players[allSockets.indexOf(socket)] +". Wait for another Player");
				var l = players[allSockets.indexOf(socket)];
				
				socket.emit("getLetter", l);
		}
		else { 
			emptyField();
			var l = players[allSockets.indexOf(socket)];
			
			socket.emit("getLetter",l );
			io.emit("getField", field);
			io.emit("turn", "M");
			io.emit("start", "");
		}
	}
	else
	{
		socket.emit("wait", "The room is full"); 
	}
		
	});
	
	socket.on("clicked", function(p){
		var ind = 0;
		var letter = p.letter;
		var r = p.x;
		var c = p.y;
		if(field[r][c] == ".") 
		{
			field[r][c] = letter;
			io.emit("getField", field);
			if(letter == 'M')
			{
				io.emit("turn", 'O');
			}
			else
			{
				io.emit("turn", 'M');
			}
		}
	}); 
	
	socket.on("clear", function(nothing){
		emptyField();
		io.emit("getField", field);
	});
	
});

function emptyField()
{
	var r; var c;
	field = new Array(3);
	for(r = 0; r < 3; ++r)
	{
		field[r] = new Array(3);
		for(c = 0; c < 3; ++c)
		{
			field[r][c] = '.';
		}
	}
}
function getEmptyLetter()
{
	if(players.length == 0 || (players.length == 1 && players[0] == "O"))
		return "M";
	else
		return "O";
}

server.listen(8028, function() {
	console.log("Server is listening on port 8028");
});