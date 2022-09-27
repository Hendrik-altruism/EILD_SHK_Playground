//Initialisierung des WebDAV Clients, der Datenbank und der Intervallfunktion
var client
var tag;

//Nutzer loggt sich mit seinen LEA Daten ein
async function login() {
    initCon(document.getElementById("StudData"), document.getElementById("StudPw"))
    tag = document.getElementById("StudData").value
    document.querySelector(".popup").style.display = "none";
}

//Verbindung zum LEA WebDAV Client wird hergestellt
function initCon(User, Pw) {
    client = window.WebDAV.createClient("https://lea.hochschule-bonn-rhein-sieg.de/webdav.php/db_040811/ref_1209729/", {
        authType: window.WebDAV.AuthType.Digest,
        maxContentLength: 1000000,
        username: User,
        password: Pw
    });
    progressCallback()
}
function progressCallback() {
    console.log("done");
}

//Datenbank Funktionen
//Fügt einen Eintrag in die Datenbank hinzu
async function addRun() {
    const run = {
        studTag: document.getElementById("InputStudID").value,
        points: document.getElementById("InputPoints").value
    }
    data = await client.getFileContents("/data.json", { format: "text" })
    data = data.substring(0, data.length - 2)
    console.log(data)
    if (data.length > 20) {
        data = data.concat(", " + JSON.stringify(run) + "]}")
    } else {
        data = data.concat('{"runs": [' + JSON.stringify(run) + "]}")
    }
    console.log(data)
    client.putFileContents("/data.json", data)
    clearInput()
}

//Setzt die Datenbank zurück
async function clearRun() {
    const idbDatabase = db.backendDB()
    try {
        await clearDatabase(idbDatabase, function (err) { })
    }
    catch (error) {
        console.error('' + error);
    }
    updateFile()
    showContent()
}

//Klärt die Input Felder
function clearInput() {
    document.getElementById("RunID").value = ""
    document.getElementById("InputStudID").value = ""
    document.getElementById("InputPoints").value = ""
}

//Promises
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}