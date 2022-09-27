var hashValue
var tag
//User login with his student data to allow WebDAV access to the script 
async function login() {
    tag = document.getElementById("StudData").value
    hashValue = hash(tag)
    console.log(hashValue)
    initCon(document.getElementById("StudData"), document.getElementById("StudPw"))
    document.querySelector(".popup").style.display = "none";
}

//Intialization of the user Connection with console log aon completion
function initCon(User, Pw) {
    client = window.WebDAV.createClient("https://lea.hochschule-bonn-rhein-sieg.de/webdav.php/db_040811/ref_1293869/", {
        authType: window.WebDAV.AuthType.Digest,
        maxContentLength: 1000000,
        username: User,
        password: Pw
    });
    progressCallback()
    call()
}
function progressCallback() {
    console.log("done")
}

//Scans for existing User direkcory and creates it, if needed
async function call() {

    try { await client.getFileContents("/" + hashValue + ".json", { format: "text" }) }
    catch (e) {
        console.log("User Directory needs to be created")
        data = "[]"
        client.putFileContents("/" + hashValue + ".json", data)
    }
}

//Inserts the Run into the Json File
async function insertRun(file) {
    const run = {
        correct: file.sections[file.sections.length - 1].correct,
        key: file.phrases[file.sections.length - 1].key,
    }
    data = await client.getFileContents("/" + hashValue + ".json", { format: "text" })
    data = data.substring(0, data.length - 2)
    if (data.length > 20) {
        data = data.concat("," + JSON.stringify(run) + "]}")
    } else {
        data = data.concat('{"runs": [' + JSON.stringify(run) + "]}")
    }
    client.putFileContents("/" + hashValue + ".json", data)
}

//Sleep function -> stop the script in case of a lock
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function hash(s) {
    /* Simple hash function. */
    var a = 1, c = 0, h, o;
    if (s) {
        a = 0;
        /*jshint plusplus:false bitwise:false*/
        for (h = s.length - 1; h >= 0; h--) {
            o = s.charCodeAt(h);
            a = (a << 6 & 268435455) + o + (o << 14);
            c = a & 266338304;
            a = c !== 0 ? a ^ c >> 21 : a;
        }
    }
    return String(a);
};