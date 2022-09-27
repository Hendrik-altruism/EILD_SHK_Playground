//Event Listener
window.addEventListener("beforeunload", function (e) {
    db.delete()
}, false);
window.addEventListener("onunload", function (e) {
    db.delete()
}, false);


//Initialization of the WebDavClient and the local Version of the Database 
var client
var tag
var db = new Dexie("ER_Runs")
db.version(1).stores({
    runs: "++id, studTag, correct, key"
})

//User login with his student data to allow WebDAV access to the script 
async function login() {
    initCon(document.getElementById("StudData"), document.getElementById("StudPw"))
    tag = document.getElementById("StudData").value
    document.querySelector(".popup").style.display = "none";
}

//Intialization of the user Connection with console log aon completion
function initCon(User, Pw) {
    client = window.WebDAV.createClient("https://lea.hochschule-bonn-rhein-sieg.de/webdav.php/db_040811/ref_1263132/", {
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

//Get the Current global version of the database 
async function getUpdated() {
    const idbDatabase = db.backendDB()
    const directoryItems = await client.getDirectoryContents("/")
    for (var i = 1; i < directoryItems.length; i++) {
        var tempName = directoryItems[i].filename
        var tempData = await client.getFileContents("/" + tempName, { format: "text" });
        try {
            await importFromJsonString(idbDatabase, tempData, function (err) { showContent() })
        } catch (error) {
            console.error('' + error);
            return false
        }
    }
    return true
}

//Compares the version and calls and update if required
async function checkIfUpgradeNeeded() {
    const file = await client.getFileContents("/erLock.txt", { format: "text" });
    if (file.substr(1) > version) {
        getUpdated()
        showContent()
        return true
    } else {
        return false
    }
}

//Database Operation functions


//Deletes entry based on an given ID passed in an Input field
//Lock mechanism => if locked wait and break the lock after 5 tries and 0.5 sec
//Calls delete with a given Index

//Reset the database
async function clearRun() {
    const idbDatabase = db.backendDB()
    try {
        await clearDatabase(idbDatabase, function (err) { })
    }
    catch (error) {
        console.error('' + error);
    }
    showContent()
}


//Updates view on Data -> called by every operation on the database
async function showContent() {
    const tbody = document.getElementsByTagName('tbody')[0];

    var s = '<table cellpadding="2" cellspacing="2" border="1">';
    s += '<tr><th>StudentenTag</th><th>Ergebniss</th><th>Key</th></tr>'
    var n = await db.runs.count()

    for (var i = 1; i <= n; i++) {
        var run = await db.runs.get(i);
        if (run == undefined) {
            n++;
        } else {
            s += '<tr>';
            s += '<td>' + run.studTag + '</td>';
            s += '<td>' + run.correct + '</td>';
            s += '<td>' + run.key + '</td>';
            s += '</tr>';
        }
    }
    s += '</table>';
    tbody.innerHTML = s
}

//Functions to gather Information
//Find all the Runs of one User
async function findUser() {
    data = await db.runs.where({ studTag: document.getElementById("InputStudID").value }).toArray()
    console.log(data)
    clearInput()
    return data
}
//Find all Runs of on Phrase
async function findPhrase() {
    var data = await db.runs.where({ key: document.getElementById("InputKey").value }).toArray()
    var val = 0
    for (i in data) {
        if (data[i].correct == true) {
            val += 1
        }
    }
    clearInput()
    try {
        obj = JSON.parse('{"runs": data, "count": data.length, "correct": val}')
    } catch (error) {
        console.log(error)
    }
    console.log(obj)
    return obj
}

//Clears Input Fields
function clearInput() {
    document.getElementById("InputStudID").value = ""
    document.getElementById("InputCorrect").value = ""
    document.getElementById("InputKey").value = ""
}

//Sleep function -> stop the script in case of a lock
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
