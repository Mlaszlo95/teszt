const Discord = require("discord.js");

var bot = new Discord.Client();


const TOKEN = process.env.TOKEN;


var glyphTurnOn = true;
var glyphImageRoot = "./images/nekroglyph.jpg";

var admins = [];
var roles = [];

//text arguments
var text;
var untext;
var notMyAdmin;
var newGlyphMes;
var yourLevelIsToLowText;
var textWhatIsTheGlyph;
var textRedeemCodeThesePlaces;

//exception text arguments
var exceptionOne;
var exceptionTwo;
var exceptionthree;

//Alapértelmezett beállitások

const prefix = "!";
const command = "glyph";

//file name and root
const fileGotCode = "./gotcode.txt";

//felhasználóknak üzzenet. Magyarul:

    textWhatIsTheGlyph = "\n\nEzt a kódot ha beváltod, akkor az avatarodnál tudsz használni egy ilyen képet mint ez:\n";
    text = "Tessék itt van a nekros glyph kódod:\n";                                //A bot küldi a glyph kódal ezt a üzenetet.
    untext = "Bocsi, de te már kaptál glyph kódot!\n";                              //A bot ezt az üzenetet küldi ha már van glyph kódja. The bot send this message in that case if user got an code.
    newGlyphMes = "Kérem adja be a glyph kódokat veszővel, szóközzel vagy enterel elválasztva!";
    yourLevelIsToLowText = "Sajnos nem vagy még tag, ezért még nem tudok neked Glyph Kódott adni. Ahhoz hogy tag legyél el kell érned a 3-mas szintet ezen a szerveren. Ezt megtudod valósítani ha hagysz üzeneteket, majd utána kapsz xp-t. Szabadon próbálkozhatsz ebben a szobában <#412712487893467136>\n \n";
    textRedeemCodeThesePlaces = "\nBetudod váltani a kódot ezeken a helyeken. 1 - warframeben a marketnél és redeem code. Vagy 2 - ezen az oldalon: ";

    //kivételek
    exceptionOne = "```diff\n- A bot-nak nincs több kódja, de ne aggódj küldök egy üzenetet az adminoknak!``` \n<@224975936263684097> <@272762360140267520>";
    exceptionTwo = "Hiba történt a fájl megnyitásában, talán nem létezik.";
    exceptionthree ="Hiba egyik érték sincs benne a fájlban!";
    //kivételek

//Message for users. English:
    textWhatIsTheGlyph = textWhatIsTheGlyph + "If you use this code, you'll get an avatar like this image:\n";
    text = text + "Here is your nekro's glyph code:\n";                             //The bot send this message with glyph code.
    untext = untext + "I sorry but you've already got a glyph code!\n";
    yourLevelIsToLowText = yourLevelIsToLowText + "Unfortunately you haven't earned the tag rank yet and I can't give you a Glyph code currently. If you want tag, you should level up to 3 in this server. You'll enable to do this if you leave some messages and you'll get xp for them. You can freely try in this room <#412712487893467136>";
    textRedeemCodeThesePlaces = textRedeemCodeThesePlaces + "\nYou can redeem the code in these places. 1 - login in warframe and go to market, redeem code. Or 2 - this website: \n\nhttps://www.warframe.com/promocode";

    //exceptions
    exceptionOne = exceptionOne + "```diff\n- The bot doesn't have more glyph codes. But don't worry I'm sending a message for admins!\n```";
    exceptionTwo = exceptionTwo + "Bot can't open the file, maybe it doesn't exist.";
    //exceptions

//üzzenet adminoknak

var helpCode = "!code --- A kódoknak muszáj ebben a formátumba lennie xxxx-xxxx-xxxx-xxxx . Szóközel, veszővel,enterel lehet tagolni őket";
var helpDrop = "!drop --- ezzel lehet lekérni kik kaptak már kódot, egy fájlt fog át dobni.";
var helpAddGotCode = "!add --- ezzel a paranccsal lehet hozzá adni azokat akik kaptak kódot. A formátum: id xxxx-xxxx-xxxx-xxxx .A kód nem szükséges"; 
var helpDeleteGotCode = "!delete --- ezzel a paranccsal lehet kitörölni felhasználókat a kapott fájlból.";
var helpCountCode = "!count --- ezzel tudod megszámolni a kódokat, amik a botnál vannak. Ha 0 küld egy figyelmeztetést.";
var helpSwitch = "!switch --- ezzel a paranccsal ki/be lehet kapcsolni a botot, ha ki van kapcsolva akkor csak az adminok kaphatnak kódot, ha be van akkor bárki kaphat aki tag"

var botIsNotWorkingText = "A bot jelenleg, csak az adminoknak oszthat a kódot";
var botIsWorkingText = "A bot jelenleg működőképes és osztja a kódot többieknek is";

    //stilusok, style --- szöveg formázási stilusok
    var style1 = "```fix\n";                                             //ezzel lehet átállitani a glyph szinét, this value changes the color of the glyph code.
    var style2 = "```diff\n-";                                           //ezzel lehet átállitani exceptionOne üzzenet szinét, amivel értesitjük az adminok, hogy nincs több glyph kód.
    var styleEnd = "```";                                                //stilus vége

    //stilusok, style --- szöveg formázási stilusok

//Alapértelmezett beállitások

bot.on("message", function(message) {
    if(message.author.equals(bot.user)) return;
    if(message.channel.type === "dm" && message.content.toLowerCase() === prefix + command) return;
    if(message.channel.type === "dm" && checkTheAdminStatus(message)) pmMessageCode(message);
    respondCommand(prefix + command, message);
});

bot.on("ready",function(){
    admins[0] = process.env.ADMINONE;
    admins[1] = process.env.ADMINTWO;
    admins[2] = process.env.ADMINTHREE;
    roles[0] = process.env.ROLESTAG;
    roles[1] = process.env.ROLEADMIN;

    console.log("Ready!");
});    

bot.login(TOKEN);

function respondCommand(com, message){   
    if (message.content.toLowerCase() === com)
        if(chectUserNotGotGlyph(message.author.id)){
            if(message.member.roles.has(roles[1]) || (message.member.roles.has(roles[0]) && glyphTurnOn)){
                try{
                    var code = readGlyphCode();
                    userGotGlyph(message.author.id,code);
                    code = style1 + "pc: " + code + styleEnd;
                    message.author.send(text + code + textRedeemCodeThesePlaces + textWhatIsTheGlyph,{
                    files: [
                            glyphImageRoot
                        ]
                    });
                }catch(e){
                    message.channel.sendMessage(e);
                }
            }else if(glyphTurnOn){
                message.author.send(yourLevelIsToLowText);
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

    return false;
}

function userGotGlyph(author,code){
    var fs = require("fs");
    var file = fs.readFileSync("./glyph.txt", {"encoding": "utf-8"});
    fs.writeFileSync("./gotcode.txt",author + " " + code,{"encoding": "utf-8"});
}


function pmMessageCode(message){
    
    if(message.content.toLowerCase() === prefix + "help"){
        message.author.send(helpCode+"\n"+helpDrop+"\n"+helpAddGotCode+"\n"+helpDeleteGotCode+"\n"+helpCountCode+"\n"+helpSwitch);
        return ;
    }

    if(message.content.toLowerCase().indexOf(prefix + "code") == 0){
        var code = message.content.replace(prefix + "code ", "");
        code = code.replace(" ","\n").replace(/ +(?= )/g,'').replace(",","\n").replace(' , ','\n').replace(' ,','\n').replace(', ','\n');
        var codeArray = code.split("\n",19);
        if(botGotMoreCodes(codeArray)) message.author.send("Siker");
    }

    if(message.content.toLowerCase() === prefix + "drop"){
        message.channel.send("Itt vannak azok, akik már kaptak kódot", {
            files: [
                "./gotcode.txt"
            ]
        });
    }

    if(message.content.toLowerCase().indexOf(prefix + "add") == 0){
        try{
            var code = message.content.replace(prefix + "add ", "");
            if(addToFileThoseUsersWhoAlreadyGotCodes(code)) message.author.send("Siker");
        }catch(e){
            message.author.send("Hiba! Input: "+ e.message +" : "+e.lineNumber);
        } 
    }

    if(message.content.toLowerCase().indexOf(prefix + "delete") == 0){
        try{
            var code = message.content.replace(prefix + "delete ", "");
            if(deleteUserFromTheFile(code)) message.author.send("Siker");
        }catch(e){
            message.author.send(e.message);
        } 
    }

    if(message.content.toLowerCase() === prefix + "count"){
        try{
            message.author.send(countCodeInFile());
        }catch(e){
            message.author.send(e.message);
        }
    }

    if(message.content.toLowerCase() === prefix + "switch"){
        switchOfTheBotOperation(message);
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

function addToFileThoseUsersWhoAlreadyGotCodes(code){
    var fs = require("fs");
    var file = fs.readFileSync("./gotcode.txt", {"encoding": "utf-8"});

    code = code.replace(',',' ').replace(/\s\s+/g, ' ').replace(/[\n\r]/g,' ').replace(', ',' ').replace(' , ',' ').replace(' ,',' ').replace(' \n',' ');     //itt még van még néhány dolog amit lehet javitani, pld szóköz + enter ne érzékelje csak szóköznek
    if(code.length>23){
        var UsersWhoGotCodeArray = code.split(' ');
        var long = UsersWhoGotCodeArray.length;
        for(var i = 0; i<long; i++){
            if(UsersWhoGotCodeArray[i].length == 18 && file.indexOf(UsersWhoGotCodeArray[i])==-1){
               file = file + UsersWhoGotCodeArray[i];
               if(i<=long-2 &&(checkTheFormatumOfGlyphCode(UsersWhoGotCodeArray[i+1]))){
                   file = file +" "+ UsersWhoGotCodeArray[i+1];
                   i++;
               }
               file = file +"\r\n"
           }
       }
    }else{
        if(code.length == 18 && file.indexOf(code)==-1){
            file = file + code + "\r\n";
        }
    }
    fs.writeFileSync("./gotcode.txt",file,{"encoding": "utf-8"});
    return true;
}

function deleteUserFromTheFile(code){
    var fs = require("fs");
    var file = fs.readFileSync("./gotcode.txt", {"encoding": "utf-8"});

    var lineArray = file.split('\r');

    code = code.replace(" ","\n").replace(",","\n").replace(" , ","\n").replace(", ","\n").replace(" ,","\n");
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

    fs.writeFileSync("./gotcode.txt",lineArray,{"encoding": "utf-8"});
    return true;
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
        count = "Ennyi kód van a botnál: "+count;
    }
    return count;
}

function switchOfTheBotOperation(message){
    if(glyphTurnOn){
        message.author.send(botIsNotWorkingText);
        glyphTurnOn = false;
    }else{
        message.author.send(botIsWorkingText);
        glyphTurnOn = true;
    }
}
