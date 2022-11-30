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
var pos = 0
var phrases;
const span = 25
const keys = new Array();
const right = new Array();
const wrong = new Array();
var db = new Dexie("ER_Runs")
db.version(1).stores({
    runs: "id, studTag, correct, key"
})
db.open().then(function () {
    idbDatabase = db.backendDB()
})


async function login() {
    tag = document.getElementById("StudData").value
    try{
        initCon(document.getElementById("StudData"), document.getElementById("StudPw"))
        phrases = await client.getFileContents("/default.json", { format: "text" })
    }
    catch(err){
        document.getElementById("errorMessage").style.display = "block";
        document.getElementById("password").value="";
        return false;
    }
    phrases = JSON.parse( phrases );
    document.querySelector(".popup").style.display = "none";
    await getUpdated()
    createShown(pos, span)
    await showContent(50)
    $('#example').DataTable();
}

//Intialization of the user Connection with console log aon completion
function initCon(User, Pw) {
    try{
    client = window.WebDAV.createClient("https://lea.hochschule-bonn-rhein-sieg.de/webdav.php/db_040811/ref_1310448/", {
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

//Get the Current global version of the database 
async function getUpdated() {
    const directoryItems = await client.getDirectoryContents("/")
    for (let i = 1; i < directoryItems.length; i++) {
        var tempName = directoryItems[i].filename
        var tempData = await client.getFileContents("/" + tempName, { format: "text" });
        tempData = JSON.parse(tempData)
        try {
            for(let i = 0; i<tempData.runs.length; i++){
                tempData.runs[i].key = decript(tempData.runs[i].key)
            }
            await importFromJsonString(idbDatabase, JSON.stringify(tempData), function (err) { })
        } catch (error) {
            console.error('' + error);
        }
    }
    return true
}

//
async function clearRun() {
    const idbDatabase = db.backendDB()
    try {
        await clearDatabase(idbDatabase, function (err) { })
    }
    catch (error) {
        console.error('' + error);
    }
}

async function showContent() {
    const tbody = document.getElementsByTagName('tbody')[0];
    var s = ''
    for(i = 1; i<=phrases.length; i++){
      keys.push(i)
      right.push(0)
      wrong.push(0)
    }
    const collection = await db.runs.toCollection().sortBy("key")
    for (var i = 0; i < collection.length; i++) {
        var run = collection[i]
        if (run.correct) {
            right[run.key-1] += 1
        } else {
            wrong[run.key-1] += 1
        }
        var decKey = run.key-1
        s += '<tr>';
        s += '<td>' + run.studTag + '</td>';
        s += '<td>' + run.correct + '</td>';
        s += '<td><a href="javascript:callPopup('+decKey+')" class="tableLinks">'+ run.key +'</a></td>';
        s += '</tr>';

    }
    s += '';
    tbody.innerHTML = s
    createChart(0)
    if(pos+span<keys.length){document.getElementById("next").classList.remove('disabled')}
}

//Create Values for Chart to be plotted
async function createChart(outputSpan){
  kArray = new Array();
  rArray = new Array();
  wArray = new Array();
  for(i = outputSpan; i<outputSpan+span&&i<phrases.length; i++){
    kArray.push(i+1)
    rArray.push(right[i])
    wArray.push(wrong[i])
  } 
  plotChart(kArray, rArray, wArray) 
  pos = outputSpan 
}

//Navigation Functions for the Highcharts Plot
async function changeNext(){
  if( !document.getElementById("next").classList.contains('disabled')){
    createChart(pos+span)
    document.getElementById("prev").classList.remove('disabled')
    if(pos+span>=keys.length){document.getElementById("next").classList.add('disabled')}
    createShown(pos, span)
  }
}
async function changePrevious(){
   if(!document.getElementById("prev").classList.contains('disabled')){
    createChart(pos-span)
    document.getElementById("next").classList.remove('disabled')
    if(pos-span<=0){document.getElementById("prev").classList.add('disabled')}
    createShown(pos, span)
   }
}
async function createShown(akt, range){
  const shown = document.getElementById('route')
  shown.innerHTML = '<a class="page-link">'+(akt+1)+" bis "+Math.min((akt+range), phrases.length)+'</a>'
}



function decript(skey){
    var alist = skey.split("_");
    let ent = [];
    let sol = [];
    for(let b = 0; b<alist.length;b++){
        if(alist[b].length>2){
            ent.push(alist[b])
        }else{
            sol.push(alist[b])
        }
    }
    var nkey=0
    for(let i=0;i<phrases.length;i++){
      if(phrases[i].entities.toString()===ent.toString()&&phrases[i].solution.toString()===sol.toString()){
        nkey=i+1
      }
    }
    return nkey;
}

//Highchart function to create the chart
function plotChart(keyArray, rightArray, wrongArray) {

    Highcharts.chart('graph1', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Phrasen Ergebnisse'
        },
        xAxis: {
            categories: keyArray,
            labels: {
              
            }
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
                stacking: 'percent',
                events: {
                   click: function(oEvent){
                     callPopup(oEvent.point.x+pos)
                   }
                }
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

//Function to call the popub window for Phrase information
function callPopup(phraseID){
  document.getElementById('headline').innerHTML = "Phrase: "+ (phraseID+1)
  var phrase = phrases[phraseID]
  var p = '<div class="DataField"><span class="identifier">Text: </span><span class="variable">'+phrase.text.toString()+'</span></div>'  
  p+= '<div class="DataField"><span class="identifier">Entitäten: </span><span class="variable">'+phrase.entities.toString()+'</span></div>'
  if(phrase.hasOwnProperty('relation')){
  p+= '<div class="DataField"><span class="identifier">Relation: </span><span class="variable">'+phrase.relation.toString()+'</span></div>'
  } else {
    p+= '<div class="DataField"><span class="identifier">Relation: </span><span class="variable">ist</span></div>'
  }
  p+= '<div class="DataField"><span class="identifier">Lösung: </span><span class="variable">'+phrase.solution.toString()+'</span></div>'
  p+= '<div class="DataField"><span class="identifier">Kommentare: </span><span class="variable">'+phrase.comments.toString()+'</span></div>'
  document.getElementById('containerRun').innerHTML = p
  document.querySelector(".popupRun").style.display = "flex";
}

function closePopup(){
  document.querySelector(".popupRun").style.display = "none";
}

//Phrases used in the ER-Trainer


