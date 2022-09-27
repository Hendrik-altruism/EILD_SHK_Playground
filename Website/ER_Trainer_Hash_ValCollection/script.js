//Event Listener
window.addEventListener("beforeunload", function (e) {
    db.delete()
}, false);
window.addEventListener("onunload", function (e) {
    db.delete()
}, false);


//Variables declaration
var client
var tag
var collection
var idbDatabase
var db = new Dexie("ER_Runs_Hash")
db.version(1).stores({
    runs: "id, correct, key"
})
db.open().then(function () {
    idbDatabase = db.backendDB()
})
//db.runs.add({ studTag: "default", correct: true, key: "value" })
//db.runs.delete(0)

async function login() {
    tag = document.getElementById("StudData").value
    await initCon(tag, document.getElementById("StudPw"))
    document.querySelector(".popup").style.display = "none";
    await getUpdated()
    await showContent()
    $('#example').DataTable();
}

//Intialization of the user Connection with console log aon completion
async function initCon(User, Pw) {
    client = window.WebDAV.createClient("https://lea.hochschule-bonn-rhein-sieg.de/webdav.php/db_040811/ref_1293869/", {
        authType: window.WebDAV.AuthType.Digest,
        maxContentLength: 1000000,
        username: User,
        password: Pw
    });
    progressCallback()
    return client
}

function progressCallback() {
    console.log("done");
}

//Get the Current global version of the database 
async function getUpdated() {
    const directoryItems = await client.getDirectoryContents("/")
    for (var i = 0; i < directoryItems.length; i++) {
        var tempName = directoryItems[i].filename
        var tempData = await client.getFileContents("/" + tempName, { format: "text" });
        try {
            await importFromJsonString(idbDatabase, tempData, function (err) { })
        } catch (error) {
            console.error('' + error);
        }
    }
    return true
}

async function clearRun() {
    const idbDatabase = db.backendDB()
    try {
        await clearDatabase(idbDatabase, function (err) { })
    }
    catch (error) {
        console.error('' + error);
    }
}

/*$(document).ready(async function () {
    await clearRun()
    $('#example').DataTable();
});*/

async function showContent() {
    const tbody = document.getElementsByTagName('tbody')[0];
    var s = ''
    const collection = await db.runs.toCollection().sortBy("key")
    var tempKey = collection[0].key
    const keys = [tempKey]
    const right = [0]
    const wrong = [0]
    var count = 0
    for (var i = 0; i < collection.length; i++) {
        var run = collection[i]
        if (tempKey != run.key) {
            tempKey = run.key
            keys.push(tempKey)
            count++
            right.push(0)
            wrong.push(0)
        }
        if (run.correct) {
            right[count] += 1
        } else {
            wrong[count] += 1
        }
        s += '<tr>';
        s += '<td>' + run.correct + '</td>';
        s += '<td>' + run.key + '</td>';
        s += '</tr>';

    }
    s += '';
    tbody.innerHTML = s
    createChart(keys, right, wrong)
}

//Highchart
function createChart(keyArray, rightArray, wrongArray) {

    Highcharts.chart('graph1', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Phrasen Ergebnisse'
        },
        xAxis: {
            categories: keyArray
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Ergebnisse in Prozent'
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
            shared: true
        },
        plotOptions: {
            column: {
                stacking: 'percent'
            }
        },
        series: [{
            name: 'Falsch beantwortet',
            data: wrongArray,
            color: 'red'
        }, {
            name: 'Richtig beantwortet',
            data: rightArray,
            color: 'green'
        },]
    });
}

//sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}