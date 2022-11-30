
var tag
createPopup()


async function createPopup(){
    s = `<div class="popup" style="background: rgba(0, 0, 0, 0.6);width: 100%;height: 100%;position: absolute;top: 0;display: flex;justify-content: center;align-items: center;text-align: center;">
            <div style="background: #fff;padding: 20px;border-radius: 5px;position: relative; width: 300px;">
                <input style="margin: 20px auto;display: block;width: 70%;padding: 8px;border: 1px solid gray;" type="text" id="StudData" placeholder="StudentenTag">
                <input style="margin: 20px auto;display: block;width: 70%;padding: 8px;border: 1px solid gray;" type="password" id="password" placeholder="MIA Passwort (LEA)">
                <p id="errorMessage" style="color: red;display: none">StudentenTag oder Passwort falsch!</p>
                <button style="margin: 20px auto;padding: 8px;border: 1px solid gray;width: 40%; font-size: 20px;" onclick="login()">Login</button>
            </div>
        </div>`;
    document.querySelectorAll("ccm-er_rel_trainer")[0].insertAdjacentHTML("afterend", s)
}
//User login with his student data to allow WebDAV access to the script 
async function login() {
    tag = document.getElementById("StudData").value
    try{
        initCon(document.getElementById("StudData"), document.getElementById("StudPw"))
        await client.getFileContents("/default.json", { format: "text" })
    }
    catch(err){
        document.getElementById("errorMessage").style.display = "block";
        document.getElementById("password").value="";
        return false;
    }
    document.querySelector(".popup").style.display = "none";
    call()
    return true;
}
//Intialization of the user Connection with console log aon completion
function initCon(User, Pw) {
    try{
    client = window.WebDAV.createClient("https://lea.hochschule-bonn-rhein-sieg.de/webdav.php/db_040811/ref_1325238/", {
        authType: window.WebDAV.AuthType.Digest,
        maxContentLength: 1000000,
        username: User,
        password: Pw
    });
    }catch(err){
        console.log(err)
        return err;
    }
    return client;
}


//Scans for existing User directory and creates it, if needed
async function call() {
    try { await client.getFileContents("/" + tag + ".json", { format: "text" }) }
    catch (e) {
        console.log("User Directory needs to be created")
        data = "[]"
        client.putFileContents("/" + tag + ".json", data)
    }
}

//checks if phrases in default are on actual state
async function checkPhrases(ph){
    client.putFileContents("/default.json", JSON.stringify(ph))
}   

//Inserts the Run into the Json File
async function insertRun(file) {
    const run = {
        studTag: tag,
        correct: file.results[file.results.length-2].correct,
        key: file.phrases[file.results.length-2].key,
    }
    data = await client.getFileContents("/" + tag + ".json", { format: "text" })
    data = data.substring(0, data.length - 2)
    if (data.length > 20) {
        data = data.concat("," + JSON.stringify(run) + "]}")
    } else {
        data = data.concat('{"runs": [' + JSON.stringify(run) + "]}")
    }
    client.putFileContents("/" + tag + ".json", data)
}

//Sleep function -> stop the script in case of a lock
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

