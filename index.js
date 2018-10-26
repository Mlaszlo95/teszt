const Discord = require("discord.js");

var bot = new Discord.Client();


//Alapértelmezett beállitások

//var admins;

const db = require('db')
db.connect({
  token: process.env.BOT_TOKEN,
  admin1: process.env.ADMIN_KEY1
});

const prefix = "!";
const command = "glyph";
    //file name and root
    const fileGotCode = "./gotcode.txt";

var text = "Here is your nekro's glyph code:\nTessék itt van a nekros glyph kódod:\n";                                          //A bot küldi a glyph kódal ezt a üzenetet. The bot send this message with glyph code.
var untext = "I sorry but you've already got a glyph code!\nBocsi, de te már kaptál glyph kódot!";                              //A bot ezt az üzenetet küldi ha már van glyph kódja. The bot send this message in that case if user got an code.
var notMyAdmin = "Sorry but you aren't my one of the administrators!\nSajnálom, de te nem vagy az egyik adminisztrátorom!";
var newGlyphMes = "Kérem adja be a glyph kódokat veszővel, szóközzel vagy enterel elválasztva!";
var helpCode = "!code --- A kódoknak muszáj ebben a formátumba lennie xxxx-xxxx-xxxx-xxxx . Szóközel, veszővel,enterel lehet tagolni őket";
var helpDrop = "!drop --- ezzel lehet lekérni kik kaptak már kódot, egy fájlt fog át dobni.";
var helpAddGotCode = "!add --- ezzel a paranccsal lehet hozzá adni azokat akik kaptak kódot. A formátum: id xxxx-xxxx-xxxx-xxxx .A kód nem szükséges"; 

    //exceptions, kivételek
    var exceptionOne = "```diff\n- The bot doesn't have more glyph codes. But don't worry I'm sending a message for admins!\n``````diff\n- A bot-nak nincs több kódja, de ne aggódj küldök egy üzenetet az adminoknak!``` <@224975936263684097><@272762360140267520>";
    var exceptionTwo = "Hiba történt a fájl megnyitásában, talán nem létezik. Bot can't open the file, maybe it doesn't exist.";
    //exceptions, kivételek

    //stilusok, style --- szöveg formázási stilusok
    var style1 = "```fix\n";                                             //ezzel lehet átállitani a glyph szinét, this value changes the color of the glyph code.
    var style2 = "```diff\n-";                                           //ezzel lehet átállitani exceptionOne üzzenet szinét, amivel értesitjük az adminok, hogy nincs több glyph kód.
    var styleEnd = "```";                                                //stilus vége

    //stilusok, style --- szöveg formázási stilusok

//Alapértelmezett beállitások

bot.on("message", function(message) {
    if(message.author.equals(bot.user)) return;
    if(message.channel.type === "dm" && message.author.id == '224975936263684097') pmMessageCode(message);
    respondCommand(prefix + command, message);
});

bot.on("ready",function(){
    console.log("Ready!");
});    

bot.login(db.token);

function respondCommand(com, message){   
    if (message.content.toLowerCase() === com)
        if(chectUserNotGotGlyph(message.author.id)){
            try{
                var code = readGlyphCode();
                userGotGlyph(message.author.id,code);
                code = style1 + code + styleEnd;
                message.author.send(text + code);
            }catch(e){
                message.channel.sendMessage(e);
            }
        }else{
            message.author.send(untext);
        }
}

function readGlyphCode(){
    var fs = require("fs");
    var file = fs.readFileSync("./glyph.txt", {"encoding": "utf-8"});
    
    if(file.length<18){
        throw exceptionOne;
    }

    code = file.slice(0, 20).replace('\r','');
    file = file.replace(code,'').split("\n").slice(1).join("\n");
    
    fs.writeFileSync("./glyph.txt",file,{"encoding": "utf-8"});
    
    return code;
}

function chectUserNotGotGlyph(author){
    var fs = require("fs");
    var file = fs.readFileSync("./gotcode.txt", {"encoding": "utf-8"});
    
    if(file.indexOf(author) == -1){
        return true;
    }
    //console.log(file.indexOf(author));

    return false;
}

function userGotGlyph(author,code){
    var fs = require("fs");
    var file = fs.readFileSync("./glyph.txt", {"encoding": "utf-8"});
    fs.writeFileSync("./gotcode.txt",author + " " + code,{"encoding": "utf-8"});
}

function pmMessageCode(message){
    if(message.content.toLowerCase() === prefix + "help"){
        message.author.send("```"+helpCode+"\n"+helpDrop+"\n"+helpAddGotCode+"```");
        return ;
    }
    if(message.content.toLowerCase().indexOf(prefix + "code") == 0){
        var code = message.content.replace(prefix + "code ", "");
        code = code.replace(" ","\n").replace(",","\n");
        var codeArray = code.split("\n",19);
        if(botGotMoreCodes(codeArray)) message.author.send("Siker");
    }
    if(message.content.toLowerCase() === prefix + "drop"){
        message.channel.send("Itt vannak azok, akik már kaptak kódot", {
            files: [
                "./gotcode.txt"
            ]
        })
    }
    if(message.content.toLowerCase() === prefix + "add"){
        var code = message.content.replace(prefix + "add ", "");
        code = code.replace(" ","\n").replace(",","\n");
        var codeArray = code.split("\r\n");
        message.author.send(codeArray[0]);
        message.author.send(codeArray[1]);
        if(addToFileThoseUsersWhoAlreadyGotCodes(codeArray)) message.author.send("Siker");
    }
}
/*
function checkTheAdminStatus(message){
    for(var i = 0; i<admins.length;i++){
        if(admins[i] == message.author.id) return true;
    }

    return false;
}
*/
function botGotMoreCodes(codeArray){
    var fs = require("fs");
    var file = fs.readFileSync("./glyph.txt", {"encoding": "utf-8"});

    for(var i = 0; i < codeArray.length; i++){
        if(checkTheFormatumOfGlyphCode(codeArray[i])){
            file = file + codeArray[i] + "\r\n";
        }
    }
    fs.writeFileSync("./glyph.txt",file,{"encoding": "utf-8"});
    return true;
}

function checkTheFormatumOfGlyphCode(code){
    var rightIndex = code.indexOf('-') + 1;
    var rightIndex = rightIndex + code.indexOf('-',2)+ 1;
    var rightIndex = rightIndex + code.indexOf('-',3)+ 1;
    if(rightIndex == 15 && codeArray[i].length == 19){
        return true;
    }
    return false;
}

function addToFileThoseUsersWhoAlreadyGotCodes(UsersWhoGotCodeArray){
    var fs = require("fs");
    var file = fs.readFileSync("./gotcode.txt", {"encoding": "utf-8"});
    
    for(var i = 0; i < UsersWhoGotCodeArray.length-1; i=i+2){
        if(UsersWhoGotCodeArray[i].lenght == 19 && file.indexOf(UsersWhoGotCodeArray[i]) == -1){
            if(checkTheFormatumOfGlyphCode(UsersWhoGotCodeArray[i+1])){
                file = file + UsersWhoGotCodeArray[i] + " " + UsersWhoGotCodeArray[i+1] + "\r\n";
             }else{
                file = file + UsersWhoGotCodeArray[i] + "\r\n";
             }
        }  
    }
    fs.writeFileSync("./gotcode.txt",file,{"encoding": "utf-8"});
    return true;
}
