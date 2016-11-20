var socket = io();
var myLetter;
var turn;


$(doThisWhenLoaded);

function doThisWhenLoaded() {
	socket.emit("UserConnected", "");
	
	var i;
	var j;
	
	$("#clear").click(function() {
		socket.emit("clear", "");
	});
	
	socket.on("wait", function(msg) {
		$("#waitText").text(msg);
		$("#mainDiv").hide();
		$("#waitDiv").show();
	});
	socket.on("getLetter", function(letter) {
		myLetter = letter;
		console.log("me letter " + myLetter);
	});
	
	socket.on("turn", function(t) {
		turn = t;
		console.log("turn " + turn);
		$("#turn").text(turn +"'s turn");
	});
	socket.on("start", function(nothign) {
		$("#PlayerLetter").text("Your Letter is " + myLetter);
		$("#waitDiv").hide();
		$("#mainDiv").show();
	});
	
	socket.on("getField", function(field) {
		for(i =0; i < 3; ++i)
		{
			for(j=0; j < 3; ++j)
			{
				$("#field .row").eq(i).find(".cell").eq(j).text(field[i][j]);
			}
		}
	});

	for(i =0; i < 3; ++i)
	{
		for(j = 0; j  < 3; ++j)
		{
			$("#field .row").eq(i).find(".cell").eq(j).click(makeClickHandlerFor(i,j));
		}
	}
}

function makeClickHandlerFor(x,y)
{
	 var f = function() {
		if(turn == myLetter)
		{
		obj = {letter: myLetter, x: x, y: y};
			socket.emit("clicked", obj);
		}
			
	 }

	 return f; 
	
}
