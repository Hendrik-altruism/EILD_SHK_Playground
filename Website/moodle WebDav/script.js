//Initialisierung des WebDAV Clients, der Datenbank und der Intervallfunktion
var client
var db = new Dexie("indexedDataBase")
db.version(1).stores({
    runs: "++id, studTag, points"
})
setInterval(checkIfUpgradeNeeded, 2000)
initCon()

//Verbindung zum LEA WebDAV Client wird hergestellt
function initCon() {
    client = window.WebDAV.createClient("http://localhost/pluginfile.php/16/mod_resource/content/1/", {
        authType: window.WebDAV.AuthType.Digest,
        maxContentLength: 1000000,
        username: "user",
        password: "123"
    });
    progressCallback()
    showContent()
}
function progressCallback() {
    console.log("done");
}

//Update Funktionen (noch nicht Optimiert)
async function updateFile() {
    try {
        const idbDatabase = db.backendDB()
        exportToJsonString(idbDatabase, function (err, jsonString) {
            client.putFileContents("/Data.json", jsonString);
        })
    } catch (error) {
        console.error('' + error);
    }
}
async function getUpdated() {
    const file = await client.getFileContents("/Data.json", { format: "text" });
    const idbDatabase = db.backendDB()
    try {
        await clearDatabase(idbDatabase, function (err) { })
        await importFromJsonString(idbDatabase, file, function (err) { showContent() })
    } catch (error) {
        console.error('' + error);
        return false
    }
    return true
}

//Tested die geteilte Datenbank auf Veränderungen und übernimmt diese
async function checkIfUpgradeNeeded() {
    const file = await client.getFileContents("/Data.json", { format: "text" });
    const idbDatabase = db.backendDB()
    exportToJsonString(idbDatabase, function (err, jsonString) {
        if (jsonString == file) {
            return false
        } else {
            getUpdated()
            showContent()
            return true
        }
    })
}

//Datenbank Funktionen
//Fügt einen Eintrag in die Datenbank hinzu
async function addRun() {
    await db.runs.add(
        { studTag: document.getElementById("InputStudID").value, points: document.getElementById("InputPoints").value }
    )
    updateFile()
    showContent()
    clearInput()
}

//löscht einen Eintrag nach der eingegeben ID
async function deleteRun() {
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
    try {
        await db.delete()
        db = new Dexie("indexedDataBase")
        db.version(1).stores({
            runs: "++id, studTag, points"
        })
    } catch (error) {
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
    const tbody = document.getElementsByTagName('tbody')[0];

    var s = '<table cellpadding="2" cellspacing="2" border="1">';
    s += '<tr><th>RunId</th><th>StudentenTag</th><th>Punkte</th></tr>'
    var n = await db.runs.count()

    for (var i = 1; i <= n; i++) {
        var run = await db.runs.get(i);
        if (run == undefined) {
            n++;
        } else {
            s += '<tr>';
            s += '<td>' + run.id + '</td>';
            s += '<td>' + run.studTag + '</td>';
            s += '<td>' + run.points + '</td>';
            s += '<td><a href="#" onclick="deleteRunExtra(' + run.id + ')">Löschen</a> | <a href="#" onclick="updateExtra(' + run.id + ')">Ändern</a></td>';
            s += '</tr>';
        }
    }
    s += '</table>';
    tbody.innerHTML = s
}
