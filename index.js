const Discord = require("discord.js");

var bot = new Discord.Client();

bot.on("ready",function(){
    console.log("Ready!");
}); 

bot.on("message", function(message) {
    if(message.content.toLowerCase() === "!ping"){
		message.channel.sendMessage("pong");
	}
});

bot.login(process.env.BOT_TOKEN);
