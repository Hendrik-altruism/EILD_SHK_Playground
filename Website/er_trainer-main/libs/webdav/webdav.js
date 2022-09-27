


//Initialization of the WebDavClient and the local Version of the Database 
var client
var tag;
var db = new Dexie("ER_Data")
var version = 0;
db.version(1).stores({
    runs: "++id, studTag, correct, key"
})

//Optional Intervall to refresh the database
//setInterval(checkIfUpgradeNeeded, 1000)

//User login with his student data to allow WebDAV access to the script 
async function login() {
    initCon(document.getElementById("StudData"), document.getElementById("StudPw"))
    showContent()
    tag = document.getElementById("StudData").value
    document.querySelector(".popup").style.display = "none";
}

//Intialization of the user Connection with console log aon completion
function initCon(User, Pw) {
    client = window.WebDAV.createClient("https://lea.hochschule-bonn-rhein-sieg.de/webdav.php/db_040811/ref_1263077/", {
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

//Update Function and reset of the lock mechanism
async function updateFile() {
    try {
        const idbDatabase = db.backendDB()
        version += 1;
        exportToJsonString(idbDatabase, function (err, jsonString) {
            client.putFileContents("/file.json", jsonString);
            client.putFileContents("/erLock.txt", "0" + version)
        })
    } catch (error) {
        console.error('' + error);
    }
}

//Get the Current global version of the database 
async function getUpdated() {
    const file = await client.getFileContents("/file.json", { format: "text" });
    const lock = await client.getFileContents("/erLock.txt", { format: "text" });
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

async function checkLock() {
    var lock = await client.getFileContents("/erLock.txt", { format: "text" })
    if (lock.charAt(0) == "1") {
        var i = 0
        do {
            sleep(100)
            i += 1
            lock = await client.getFileContents("/erLock.txt", { format: "text" })
        }
        while (lock.charAt(0) == "1" && i < 5)
    }
    client.putFileContents("/erLock.txt", "1" + lock.substr(1))
    return true
}

//Database Operation functions

//Adds Entry in the database, based on given JSON-Object
async function insertRun(file) {
    await checkLock()
    await checkIfUpgradeNeeded()
    try {
        await db.runs.add(
            {
                studTag: tag,
                correct: file.sections[file.sections.length - 1].correct,
                key: file.phrases[file.sections.length - 1].key,
            }
        )
    } catch (error) { console.log(error) }
    updateFile()
    showContent()
}

//Deletes entry based on an given ID passed in an Input field
//Lock mechanism => if locked wait and break the lock after 5 tries and 0.5 sec
//Calls delete with a given Index
async function deleteRun(param) {
    await checkLock()
    await checkIfUpgradeNeeded()
    await db.runs.delete(parseInt(param))
    updateFile()
    showContent()
}

//Reset the database
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


//Updates view on Data -> called by every operation on the database
async function showContent() {
    //not yet implemented for er_trainer.js
}

//Functions to gather Information
//Find all the Runs of one User
async function findUser(name) {
    await getUpdated()
    return data = await db.runs.where({ studTag: name }).toArray()
}
//Find all Runs of on Phrase
async function findPhrase(phraseKey) {
    data = await db.runs.where({ key: phraseKey }).toArray()
    correct = 0
    for (i = 0; i < data.length; i++) {
        if (data[i].correct == "true") {
            correct += 1
        }
    }
    return obj = JSON.parse('{"runs": ' + data + ', "count": ' + data.length + ', "correct": ' + correct + '}')
}

//Sleep function -> stop the script in case of a lock
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

