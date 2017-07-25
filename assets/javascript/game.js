//player object
var player;
//array that stores computer player objects
var cpu1;
var cpu2;
var cpu3;
var coms = [cpu1, cpu2, cpu3];
var charChosen;
var enemyChosen;
var currentEnemy;
var playerDead;


//Functions

//object creation function
//first is the name of character
//health is the health points
//pow is attack power
//counter is the counter attack power
//this function is an object constructor function and serves as a prototype for all characters. 
function character (first, health, basePower)
{
	this.name = first;
	this.baseHp = parseInt(health);
	this.hp = parseInt(health);
	this.pow = parseInt(basePower);
	this.counter = parseInt(basePower);
	this.isDead = false;
}

//function to initialize cpu objects for later use in code. need them to be defined as objects. 
function initialize ()
{	
	$(".char").each(function()
	{
		$(this).children(".health").text($(this).attr("hp"));
		$(this).css("background-color", "#9700B2");
		$("#character").append($(this));
	});
	$("#choose").text("Choose Your Character");
	$("#combat").hide();
	$("#defender").hide();
	$(".text").hide();
	$(".char").show();
	$("#reset").hide();
	charChosen = false;
	enemyChosen = false;
	playerDead = false;
	for (var i = 0; i < coms.length; i++) 
	{
		coms[i] = new character("",0,0);
	}
	return coms;
}

//setCpu creates cpu players based on what the player chose
//I attempted using a for loop earlier, but I couldn't get the cod to execute properly.
//I settled for creating my own, for-like loop. I'd love to know a more efficent way to do this
//The .each method of jquery loops through all html elements with the provided attribute. 
//Once inside each element I check if the id matches any object names, if not I create the object.
//once the each cpu has a character object associated with it, I end the loop by returning. 
function setCpu (player)
{
	var i = 0;

	$(".char").each(function()
	{

		if (i === coms.length)
		{
			return;
		}

		if(this.id !== coms[i].name && this.id !== player.name)
		{
			coms[i] = new character($(this).attr("id"), $(this).attr("hp"), $(this).attr("pow"));
			i++;
		}
	});
}

//move will move character images from one div to another
//id is the id of the div where the img should go
//char is the object associated with the character. 
function move (id, char)
{
	$(id).append($("#"+char.name));
}

//attack is a function that takes two arguments
//player is the player character
//cpu is the computer character
function attack (player,cpu)
{
	cpu.hp = cpu.hp - player.pow;
	player.hp = player.hp - cpu.counter;

	//code that displays new health text on DOM
	$("#"+player.name).children(".health").text(player.hp);
	$("#"+cpu.name).children(".health").text(cpu.hp);
	$(".text").show();
	$("#playerAttack").text("You attacked " + $("#"+cpu.name).children(".name").text() + " for " + player.pow + " damage!");
	$("#enemyAttack").text($("#"+cpu.name).children(".name").text() + " attacked you for " + cpu.counter + " damage!");

	//if the player is still alive after attack, level up!
	if(player.hp > 0)
	{
		player.pow = player.pow + player.counter;
	}
	else if(player.hp <= 0)
	{
		$("#reset").show();
		playerDead = true;
		$("#enemyAttack").hide();
		$("#playerAttack").text("You have been defeated by " + $("#"+cpu.name).children(".name").text() + ". Press restart to try again.");
	}
	if(cpu.hp <= 0)
	{
		cpu.isDead = true;
		$("#"+cpu.name).hide();
		enemyChosen = false;
		$("#enemyAttack").hide();
		$("#playerAttack").text("You have defeated " + $("#"+cpu.name).children(".name").text() + "! Choose a new combatant!");
	}
	//checks that all cpu's are dead
	if(coms[0].isDead && coms[1].isDead && coms[2].isDead)
	{
		$("#enemyAttack").hide();
		$("#playerAttack").text("You have defeated all combatants. You reign supreme! Press restart to play again.");
		$("#reset").show();
	}
}

// The game begins
$(document).ready(function() 
{
	initialize();
	move("#currentEnemy","iceKing");
	//click event for choosing player
	//on player choice all character objects are created.
	//this section only works when charChosen is false.
	$(".char").click(function()
	{
		if(!charChosen && !playerDead)
		{	
			//changes text to Your Character
			$("#choose").text("Your Character");
			//creates player character
			player = new character($(this).attr("id"), $(this).attr("hp"), $(this).attr("pow"));
			//set charChosen to true, so player cannot select new character
			charChosen = true;
			//function creates cpu objects.
			setCpu(player);
			//moves enemies to proper div
			for (var i = 0; i < coms.length; i++) 
			{
				$("#"+coms[i].name).css("background-color", "#3BB969");
				move("#enemy",coms[i]);
			}

			//shows text once players choice has been made. 
			$("#combat").show();
			$("#defender").show();

			//need to change style.
		}
		//Logic for choosing enemy player
		//if enemyChosen is false player can choose enemy, but only if charChosen is true.
		if(!enemyChosen && charChosen && !playerDead)
		{
			//goes through possible objects
			for (var i = 0; i < coms.length; i++) 
			{
				//picks the one that matches clicked image.
				if(this.id === coms[i].name)
				{
					move("#currentEnemy",coms[i]);
					$("#"+coms[i].name).css("background-color","#FF410F");
					currentEnemy = coms[i];
					enemyChosen = true;
					//change style too
				}
			}
		}
	});

	//click event for attack button
	$("#fight").click(function()
	{
		if(!playerDead && enemyChosen)
		{
			attack(player,currentEnemy);
			//remove this eventually...
			console.log(currentEnemy.hp);
			console.log(player.pow);
			console.log(player.hp);
		}
	});

	//click event for reset
	$("#reset").click(function()
	{
		initialize();
	});
});

//ASK ABOUT COMPETING VALUES, there are cases when the player dies, but kills the combatant on the same move, defaults to choose new combatant.












