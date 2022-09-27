var client
var tag
var collection
var db = new Dexie("ER_Runs")
db.version(1).stores({
    runs: "++id, studTag, correct, key"
})

//db.runs.add({ studTag: "default", correct: true, key: "value" })
//db.runs.delete(0)

async function login() {
    initCon(document.getElementById("StudData"), document.getElementById("StudPw"))
    showContent()
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
    await clearRun()
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

$(document).ready(async function () {
    await login()
    await getUpdated()
    await showContent()
    $('#example').DataTable();
});

async function showContent() {
    const tbody = document.getElementsByTagName('tbody')[0];
    var s = ''
    var n = await db.runs.count()
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
        s += '<td>' + run.studTag + '</td>';
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