//Initialisierung des WebDAV Clients, der Datenbank und der Intervallfunktion
var client
var tag;
var db = new Dexie("studRun")
var version = 0;
db.version(1).stores({
    runs: "++id, studTag, points"
})
setInterval(checkIfUpgradeNeeded, 1000)

//Nutzer loggt sich mit seinen LEA Daten ein
async function login() {
    initCon(document.getElementById("StudData"), document.getElementById("StudPw"))
    showContent()
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

//Update Funktionen (noch nicht Optimiert)
async function updateFile() {
    try {
        const idbDatabase = db.backendDB()
        version += 1;
        exportToJsonString(idbDatabase, function (err, jsonString) {
            client.putFileContents("/data.json", jsonString);
            client.putFileContents("/lock.txt", "0" + version)
        })
    } catch (error) {
        console.error('' + error);
    }
}

async function getUpdated() {
    const file = await client.getFileContents("/data.json", { format: "text" });
    const lock = await client.getFileContents("/lock.txt", { format: "text" });
    const idbDatabase = db.backendDB()
    try {
        await clearDatabase(idbDatabase, function (err) { })
        await importFromJsonString(idbDatabase, file, function (err) { showContent() })
        version = parseInt(lock.substr(1))
    } catch (error) {
        console.error('' + error);
        return false
    }
    return true
}

//Tested die geteilte Datenbank auf Veränderungen und übernimmt diese
async function checkIfUpgradeNeeded() {
    const file = await client.getFileContents("/lock.txt", { format: "text" });
    if (file.substr(1) > version) {
        getUpdated()
        showContent()
        return true
    } else {
        return false
    }
}

//Datenbank Funktionen
//Fügt einen Eintrag in die Datenbank hinzu
async function addRun() {
    var lock = await client.getFileContents("/lock.txt", { format: "text" })
    if (lock.charAt(0) == "1") {
        var i = 0
        do {
            sleep(100)
            i + 1
            lock = await client.getFileContents("/lock.txt", { format: "text" })
        }
        while (lock.charAt(0) == "1" && i < 5)
    }
    client.putFileContents("/lock.txt", "1" + lock.substr(1))
    checkIfUpgradeNeeded()
    await db.runs.add(
        {
            studTag: document.getElementById("InputStudID").value,
            points: document.getElementById("InputPoints").value
        }
    )
    updateFile()
    showContent()
    clearInput()
}

//löscht einen Eintrag nach der eingegeben ID
async function deleteRun() {
    var lock = await client.getFileContents("/lock.txt", { format: "text" })
    if (lock.charAt(0) == "1") {
        var i = 0
        do {
            sleep(100)
            i + 1
            lock = await client.getFileContents("/lock.txt", { format: "text" })
        }
        while (lock.charAt(0) == "1" && i < 5)
    }
    client.putFileContents("/lock.txt", "1" + lock.substr(1))
    checkIfUpgradeNeeded()
    await db.runs.delete(parseInt(document.getElementById("RunID").value))
    updateFile()
    showContent()
    clearInput()
}

//löscht einen Eintrag durch Click in der Tabelle
async function deleteRunExtra(param) {
    await db.runs.delete(parseInt(param))
    updateFile()
    showContent()
}

//Ändert einen Eintrag nach der ID
async function updateRun() {
    var lock = await client.getFileContents("/lock.txt", { format: "text" })
    if (lock.charAt(0) == "1") {
        var i = 0
        do {
            sleep(100)
            i + 1
            lock = await client.getFileContents("/lock.txt", { format: "text" })
        }
        while (lock.charAt(0) == "1" && i < 5)
    }
    client.putFileContents("/lock.txt", "1" + lock.substr(1))
    checkIfUpgradeNeeded()
    await db.runs.update(
        parseInt(document.getElementById("RunID").value), { studTag: document.getElementById("InputStudID").value, points: document.getElementById("InputPoints").value }
    )
    updateFile()
    showContent()
    clearInput()
}

//Fügt den Eintrag in die Felder zur Bearbeitung
async function updateExtra(param) {
    var run = await db.runs.get(parseInt(param))
    document.getElementById("RunID").value = run.id
    document.getElementById("InputStudID").value = run.studTag
    document.getElementById("InputPoints").value = run.points
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

//Anzeigen der Datenbank in einer Tabelle
async function showContent() {
    const tbody = document.getElementsByTagName('tbody')[0]

    var s = '<table cellpadding="2" cellspacing="2" border="1">';
    s += '<tr><th>RunId</th><th>StudentenTag</th><th>Punkte</th><th>Notation</th><th>Total</th></tr>'
    var n = await db.runs.count()

    for (var i = 1; i <= n; i++) {
        var run = await db.runs.get(i)
        if (run == undefined) {
            n++;
        } else {
            s += '<tr>';
            s += '<td>' + run.id + '</td>'
            s += '<td>' + run.studTag + '</td>'
            s += '<td>' + run.correct + '</td>'
            s += '<td>' + run.notation + '</td>'
            s += '<td>' + run.total + '</td>'
            s += '<td><a href="#" onclick="deleteRunExtra(' + run.id + ')">Löschen</a> | <a href="#" onclick="updateExtra(' + run.id + ')">Ändern</a></td>'
            s += '</tr>'
        }
    }
    s += '</table>'
    tbody.innerHTML = s
}

//Promises
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

