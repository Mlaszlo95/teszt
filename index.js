const Discord = require("discord.js");

var bot = new Discord.Client();


//Alapértelmezett beállitások

//const TOKEN = process.env.BOT_TOKEN;
//var admins;

const aws = require('aws-sdk');
let s3 = new aws.S3({
    TOKEN: process.env.TOKEN,
    admin1: process.env.ADMINONE,
    admin2: process.env.ADMINTWO,
    admin3: process.env.ADMINTHREE
});

var admins = [s3.admin1,s3.admin2,s3.admin3];

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
var helpDeleteGotCode ="!delete --- ezzel a paranccsal lehet kitörölni felhasználókat a kapott fájlból.";
var helpCountCode ="!count --- ezzel tudod megszámolni a kódokat, amik a botnál vannak. Ha 0 küld egy figyelmeztetést.";

    //exceptions, kivételek
    var exceptionOne = "```diff\n- The bot doesn't have more glyph codes. But don't worry I'm sending a message for admins!\n``````diff\n- A bot-nak nincs több kódja, de ne aggódj küldök egy üzenetet az adminoknak!``` <@224975936263684097><@272762360140267520>";
    var exceptionTwo = "Hiba történt a fájl megnyitásában, talán nem létezik. Bot can't open the file, maybe it doesn't exist.";
    var exceptionthree ="Hiba egyik érték sincs benne a fájlban!";
    //exceptions, kivételek

    //stilusok, style --- szöveg formázási stilusok
    var style1 = "```fix\n";                                             //ezzel lehet átállitani a glyph szinét, this value changes the color of the glyph code.
    var style2 = "```diff\n-";                                           //ezzel lehet átállitani exceptionOne üzzenet szinét, amivel értesitjük az adminok, hogy nincs több glyph kód.
    var styleEnd = "```";                                                //stilus vége

    //stilusok, style --- szöveg formázási stilusok

//Alapértelmezett beállitások

bot.on("message", function(message) {
    if(message.author.equals(bot.user)) return;
    if(message.channel.type === "dm" && checkTheAdminStatus(message)) pmMessageCode(message);
    respondCommand(prefix + command, message);
});

bot.on("ready",function(){
    console.log("Ready!");
});    

bot.login(s3.TOKEN);

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
        message.author.send(helpCode+"\n"+helpDrop+"\n"+helpAddGotCode+"\n"+helpDeleteGotCode+"\n"+helpCountCode);
        return ;
    }

    if(message.content.toLowerCase().indexOf(prefix + "code") == 0){
        var code = message.content.replace(prefix + "code ", "");
        code = code.replace(" ","\n").replace(/ +(?= )/g,'').replace(",","\n");
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

    if(message.content.toLowerCase().indexOf(prefix + "add") == 0){
        try{
            var code = message.content.replace(prefix + "add ", "");
            code = code.replace(',',' ').replace(/\s\s+/g, ' ').replace(/[\n\r]/g,' ');     //itt még van még néhány dolog amit lehet javitani, pld szóköz + enter ne érzékelje csak szóköznek
            var codeArray = code.split(' ');
            if(addToFileThoseUsersWhoAlreadyGotCodes(codeArray)) message.author.send("Siker");
        }catch(e){
            console.log(e);
            message.author.send("Hiba!");
        } 
    }

    if(message.content.toLowerCase().indexOf(prefix + "delete") == 0){
        try{
            var code = message.content.replace(prefix + "delete ", "");
            if(deleteUserFromTheFile(code)) message.author.send("Siker");
        }catch(e){
            message.author.send(e);
        } 
    }

    if(message.content.toLowerCase() === prefix + "count"){
        try{
            message.author.send(countCodeInFile());
        }catch(e){
            message.author.send(e);
        }
    }
}

function checkTheAdminStatus(message){
    for(var i = 0; i<admins.length;i++){
        if(admins[i] == message.author.id) return true;
    }

    return false;
}

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
    var textLenght = code.length;
    if(textLenght == 19){
        var rightIndex = code.indexOf('-') + 1;
        var rightIndex = rightIndex + code.indexOf('-',2)+ 1;
        var rightIndex = rightIndex + code.indexOf('-',3)+ 1;
        if(rightIndex == 15){
            return true;
        }
    }else{
        return false;
    }
}

function addToFileThoseUsersWhoAlreadyGotCodes(UsersWhoGotCodeArray){
    var fs = require("fs");
    var file = fs.readFileSync("./gotcode.txt", {"encoding": "utf-8"});

    for(var i = 0; i<UsersWhoGotCodeArray.length; i++){
        if(UsersWhoGotCodeArray[i].length == 18 && file.indexOf(UsersWhoGotCodeArray[i])==-1){
           if(checkTheFormatumOfGlyphCode(UsersWhoGotCodeArray[i+1])){
               file = file + UsersWhoGotCodeArray[i] +" "+ UsersWhoGotCodeArray[i+1] +"\r\n";
               i++;
           }else{
               file = file + UsersWhoGotCodeArray[i] +"\r\n";
           }
       }
   }
    fs.writeFileSync("./gotcode.txt",file,{"encoding": "utf-8"});
    return true;
}

function deleteUserFromTheFile(code){
    var fs = require("fs");
    var file = fs.readFileSync("./gotcode.txt", {"encoding": "utf-8"});

    var lineArray = file.split('\r');

    code = code.replace(" ","\n").replace(",","\n");
    code = code.split('\n');

    var findAnyElem = false;
    for(var i = 0; i<code.length;i++){
        var successfullSearch = false;
        for(var j = 0;j<lineArray.length && !successfullSearch;j++){
            if(lineArray[j].indexOf(code[i])!=-1){
                lineArray.splice(j,1);
                successfullSearch = true;
                findAnyElem = true;
            }
        }
    }
    if(!findAnyElem){
        throw exceptionthree;
    }

    lineArray = lineArray.join('\r\n');

    console.log(code);
    console.log(lineArray);

    fs.writeFileSync("./gotcode.txt",lineArray,{"encoding": "utf-8"});
}

function countCodeInFile(){
    var fs = require("fs");
    var file = fs.readFileSync("./glyph.txt", {"encoding": "utf-8"});

    var codeArray = file.split("\n");
    var count = codeArray.length;

    if(count<=5 && count!=0){
        count = "Kevés a kód: "+count;
    }else if(count == 0){
        throw exceptionFour;
    }else{
        count = "Ennyi kód van a botnál: ";
    }
    return count;
}
