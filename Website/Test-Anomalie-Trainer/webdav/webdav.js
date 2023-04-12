//Konfigurationsvariablen

/**
 * Einstellung für die Anzeige des Graphen
 * @param {true} graphSetting   -   Ergebnisse werden in Prozent angegeben -> %richtig <-> %falsch
 * @param {false} graphSetting  -   Ergebnisse werden total angegeben -> Anzahl der Durchläufe
 */
let graphSetting = false;   

/**
 * Einstellung für die Anzeige der Tabelle
 * @param {true} tableShow   -   Ergebnisse werden zusätzlich in Tabellenform mit Suchfilter angezeigt
 * @param {false} tableShow  -   Ergebnisse werden nicht in Tabellenform angezeigt
 */
const tableShow = true;

/**
 * Einstellung für die Anzeige der Ergebnisse
 * @param {true} dataAll    -   Ergebnisse aller Studenten werden zusammen angezeigt
 * @param {false} dataAll   -   Ergebnisse des bearbeitenden Studenten werden angezeigt
 */
const dataAll = true;

/**
 * URL zum WebDav-Ordner
 * @param {String} webDavLink   -   Ergebnisse werden zusätzlich in Tabellenform mit Suchfilter angezeigt
 */
const webDavLink = "https://lea.hochschule-bonn-rhein-sieg.de/webdav.php/db_040811/ref_1372783";


//Globale Variablen
window.webdav = true      //Setzt die globale Webdav Variable
let tag;                    //Tag des Nutzenden Studenten
let client;                 //Eingeloggter Client in der Webdav-Verbindung
let studData = [];          //Komplette Daten des/der Studenten       
let timeSpan = 365;         //Zeitspanne in Tagen, in der die Daten angezeigt werden        
let pos = 0;                //Anzeige-Position des Graphen
const span = 25;            //Spanne der angezeigten Phrasen im Graphen
let tablePos = 0;           //Anzeige-Position der Tabelle
const tableSpan = 10;       //Spanne der angezeigten  im Graphen
let total = 0;              //Länge der bearbeiteten Phrasen
let filter = "";            //Filtereinstellung für die Suchfunktion
let lostArr = new Array();   //Array mit der Schlüsseln der Durchläufe
let readArr = new Array();  //Array mit den richtigen Lösungen der Durchläufe
let dirtyArr = new Array();  //Array mit den falschen Lösungen der Durchläufe

//Testdaten für dei Entwicklung
const testData = {
    lost:  [
        ["2-23", "2-11", "3-7", "3-11", "3-11"],
        ["2-2", "3-6", "3-7", "3-11"]
    ],
    read:  [
        ["1-2", "3-6", "3-7", "3-11"],
        ["1-11", "2-5", "3-7", "3-11", "3-11"]
    ],
    dirty: [
        ["2-11", "2-11", "3-11", "3-11", "3-11", "3-11"],
        ["2-2", "3-6", "3-11"]
    ]
}



//Das erste Popup für den Login wird gerendert
createPopup();


/**
 * Fügt den ModalDialog in die Webseite ein
 */
async function createPopup(){
    const m = `
  <div class="modal show" id="myModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style="display: block;overflow: auto">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Nutzer Login</h5>
        </div>
        <div class="modal-body">
        <div class="form-group">
        <label for="exampleInputEmail1">Studenten Tag</label>
        <input type="text" class="form-control" id="StudData" aria-describedby="emailHelp" placeholder="LEA-Kürzel">
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input type="password" class="form-control" id="StudPw" placeholder="MIA Password (LEA)">
      </div>
      <div class="form-check">
            <p id="errorMessage" style="color: red;display: none">StudentenTag oder Passwort falsch!</p>
        </div>
        </div>
        <div class="modal-footer">
        <button class="btn btn-primary" onclick="login()">Login</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop show"></div>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  `
    document.body.insertAdjacentHTML("afterend", m)
}

/**
 * Ändert den Modaldialog, sodass die Nutzerdaten dort angezeigt werden können
 */
async function userDataPlot(){
    document.getElementById("myModal").innerHTML = ''
    const dataPop = `
    <div class="modal-dialog" role="document" style="min-width:500px;max-width:1000px">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="dataHeader">Ergebnisshistorie</h5>
          <button class="btn btn-primary" onclick="toggleDataModal()">Bearbeitung fortsetzen</button>
        </div>
        <div class="modal-body">
        </div>
      </div>
    </div>
    `
    document.getElementById("myModal").innerHTML = dataPop;
}

/**
 * Login-Funktion für den Button im Modal-Dialog
 * @returns {boolean}   -   Annnmeldevorgang erfolgreich
 */
async function login() {
    if(document.getElementById("StudData").value==""||document.getElementById("StudPw").value.toString()==""){
        document.getElementById("errorMessage").style.display = "block";
        return false
    }
    tag = hash(document.getElementById("StudData").value+document.getElementById("StudPw").value.toString())
    try{
        initCon(document.getElementById("StudData"), document.getElementById("StudPw"))  
        call();
    }
    catch(err){
        document.getElementById("errorMessage").style.display = "block";
        document.getElementById("StudPw").value="";
        return false;
    }
    document.querySelector("#myModal").style.display = "none";     
    document.querySelector(".modal-backdrop").style.display = "none";  
    userDataPlot()                                                                
    return true;
}

/**
 * Stellt die Verbindung zum WebDav-Client her
 * @param {String} User  -   StudentenTag(LEA-Nutzername)
 * @param {String} Pw    -   Studentenpassword(LEA-Password)
 * @returns {*} -   Gibt das Client-Objekt des WebDav-Scripts wieder
 */
function initCon(User, Pw) {
    try{
    client = window.WebDAV.createClient(webDavLink, {
        authType: window.WebDAV.AuthType.Digest,
        maxContentLength: 1000000,
        username: User,
        password: Pw
    });
    }catch(err){
        return err;
    }
    return client;
}

/**
 * Überprüft ob der Nutzer schon existiert und legt dann bei Bedarf eine neue Datei mit den Rechten des Nutzers an
 */
async function call() {
    try { await client.getFileContents("/" + tag + ".json", { format: "text" }) }
    catch (e) {
        console.log("User Directory needs to be created")
        const defaultdata = {
            lost:  [
                [],
                []
            ],
            read:  [
                [],
                []
            ],
            dirty: [
                [],
                []
            ]
        }
        await client.putFileContents("/" + tag + ".json", JSON.stringify(defaultdata))
    }
}  

/**
 * Fügt einen Durchlauf in die JSON-Datei des Nutzers ein
 * @param {String} trainerKey       -   Name des Trainers -> Art der Anomalie
 * @param {boolean} resultPhrase    -   Ergebniss des Durchlaufs
 * @param {String} datePhrase       -   Datum als String
 */
async function insertRun(trainerKey, resultPhrase, datePhrase) {
    const dataRaw = client.getFileContents("/" + tag + ".json", { format: "text" }) 
    const data = JSON.parse(dataRaw)
    const resultIndex = resultPhrase ?  0 : 1
    switch (trainerKey) {
        case "Lost Update":
            data.lost[resultIndex].push(datePhrase) 
            break;
        case "Non-Repeatable Read":
            data.read[resultIndex].push(datePhrase) 
            break;
        case "Dirty Read":
            data.dirty[resultIndex].push(datePhrase) 
            break;
        default:
    }
    try{
        await client.putFileContents("/" + tag + ".json", JSON.stringify(data))       
    } catch(error){
    }             
}

/**
 * Schlaffunktion, die den Betrieb des Threads für eine gewählte Zeit aussetzt
 * @param {*} ms        -   Dauer in Millisekunden, wie lange der Thread pausiert
 * @returns {Promise}   -   Gibt ein Promise-Objekt zurück, das nach einer gewissen Zeit resolved wird 
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Hashfunktion zur Verschlüsselung der Nutzerdaten und der darausfolgenden Generierung des Nutzerkeys zur Bennenung der Datei 
 * @param {String} s   -    String der gehasht wird 
 * @returns {String}   -    Hashwert als String
 */
function hash(s) {
    var a = 1, c = 0, h, o;
    if (s) {
        a = 0;
        for (h = s.length - 1; h >= 0; h--) {
            o = s.charCodeAt(h);
            a = (a << 6 & 268435455) + o + (o << 14);
            c = a & 266338304;
            a = c !== 0 ? a ^ c >> 21 : a;
        }
    }
    return String(a);
};

/**
 * Button-Funktion um den Modaldialog für die eigenen Ergebnisse zu togglen
 */
async function toggleDataModal(){
    const myModal = document.querySelector('#myModal')
    const trainer = document.querySelector('body')
    if(myModal.style.display === "none"){
        myModal.querySelector('.modal-body').innerHTML = await generateGraphTemplate();
        await fillTemplate()
        myModal.style.display = "block";
        trainer.style.overflow = "hidden";
        document.querySelector('.modal-backdrop').style.display = "block";
    }else{
        myModal.querySelector('.modal-body').innerHTML = '';
        myModal.style.display = "none";
        document.querySelector('.modal-backdrop').style.display = "none";
        trainer.style.overflow = "auto";
    }
}

/**
 * Bereitstellung des HTML-Templates für die Nutzerergebnisse 
 * @returns {String}    -   HTML-Template
 */
async function generateGraphTemplate(){
  let htmlData = `
<div class="customContainer">
    <div class="search-wrapper">
        <label for="search">Filter: </label>
        <input type="search" id="search" data-search>
    </div>
    <div class="row" id="tableBox">
        <table id="dataTable" class="table table-striped borderBox">
          <thead>
              <tr>
                  <th>Trainer</th>
                  <th>Ergebniss</th>
                  <th>Datum</th>
              </tr>
          </thead>
          <tbody id="tbody">
          </tbody>
        </table>
    </div>
</div>
<div class="container controller" id="tableController">
  <p id="totalAmount"></p>
  <ul class="pagination">
      <li id="prevTable" class="paginate_button page-item previous disabled" id="">
          <a onclick="changePreviousTable()" href="#" class="page-link">Vorherige</a>
      </li>
      <li id="routeTable" class="paginate_button page-item active">
          <a class="page-link">0 bis 10</a>
      </li>
      <li id="nextTable" class="paginate_button page-item previous disabled" id="">
          <a onclick="changeNextTable()" href="#" class="page-link">Nächste</a>
      </li>
  </ul>
</div>
<div>
  <div id="graph1">
  </div>
</div>
<div class="container controller" id="chartsController">
  <button class="btn btn-primary" id="switchGraphMode" onclick="toggleGraphSetting()">Prozent</button>
  <div class="dropdown">
  <button class="btn btn-primary" id="dropdownbtn" onclick="toggleDropDown()">Alle Ergebnisse</button>
    <ul class="dropdown-menu">
        <li class="dropdown-element"><a class="dropdown-item" href="#" onclick="execDropDown(365)" id="timeAll">Alle Ergebnisse</a></li>
        <li class="dropdown-element"><a class="dropdown-item" href="#" onclick="execDropDown(30)" id="timeThirty">Letzte 30 Tage</a></li>
        <li class="dropdown-element"><a class="dropdown-item" href="#" onclick="execDropDown(7)" id="timeSeven">Letzte 7 Tage</a></li>
    </ul>
  </div>
</div>
</div>
<style>
    .customContainer{
        padding: 0 1.5em;
    }

    .tableLinks {
      color: black;
  }
  
  div.column {
      float: left;
      margin: 12px;
      border: 2px solid #bbb;
      border-radius: 10px;
      padding: 10px;
  }
  
  #InputField {
      margin: 12;
  }
 

  #tableBox{
    display: flex;
    margin-bottom: 20px;
  }

  #dataTable{
    width: 100%;
    margin: 0;
  }
  
  .borderBox{
    border: 1px solid rgba(0, 0, 0, .1);
    border-radius: 2px;
  }

  .desHeader{
    padding: 12px 1em;
    border-width: 0px 0px 2px 0px;
    border-style: solid;
    border-color: rgba(0, 0, 0, .1);
  }

  #phraseContentDes{
      padding: 1em;
  }

  table {
      text-align: left;
  }
  
  
  #headline{
      font-size: 25px;
      font-weight: 550;
  }

  .contentUser {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
  }
  
  .identifier {
      display: block;
      font-weight: 550;
      margin-bottom: 1px;
  }
  
  .dataField {
      width: calc(100%/2 -20px);
  }
  
  .variable {
      width: 100%;
      margin-bottom: 10px;
  }

  .modal-footer button{
    margin: 20px auto;
    padding: 8px;
  }

  ul.pagination{
      margin: 0;
  }
  
  #tablePhrase {
      display: block;
  }
  
  #graph1 {
      height: 400px;
      margin-bottom: 1em; 
  }
  
  #search {
    border: 2px solid #bbb;
    border-radius: 2px;
  }
  
  .button-container{
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
  }

  .highcharts-figure,
  .highcharts-data-table table {
      min-width: 310px;
      max-width: 800px;
      margin: 1em auto;
  }
  
  .highcharts-data-table table {
      font-family: Verdana, sans-serif;
      border-collapse: collapse;
      border: 1px solid #ebebeb;
      margin: 10px auto;
      text-align: center;
      width: 100%;
      max-width: 500px;
  }
  
  .highcharts-data-table caption {
      padding: 1em 0;
      font-size: 1.2em;
      color: #555;
  }
  
  .highcharts-data-table th {
      font-weight: 600;
      padding: 0.5em;
  }
  
  .highcharts-data-table td,
  .highcharts-data-table th,
  .highcharts-data-table caption {
      padding: 0.5em;
  }
  
  .highcharts-data-table thead tr,
  .highcharts-data-table tr:nth-child(even) {
      background: #f8f8f8;
  }
  
  .highcharts-data-table tr:hover {
      background: #f1f7ff;
  }
  
  .highcharts-column-series {
      cursor: pointer;
  }
  
  .controller {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
  }
  
    </style>
    <script src="valueCollection/resources/dataTables.bootstrap5.min.js"></script>
    <script src="valueCollection/resources/bootstrap.bundle.min.js"></script>

    <script src="valueCollection/resources/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>`
    return htmlData;
}

/**
 * Ruft die Funktionen auf um das Template zu befüllen
 */
async function fillTemplate(){
  if(dataAll){
    await getUpdatedAll();
  }else{
    await getUpdatedSingle();
  }  
  await searchListener()
  if(tableShow){
    await showContent(0);
  }else{
    document.querySelector('.customContainer').style.display = "none";
    document.querySelector('#tableController').style.display = "none";
  }
}

/**
 * Importiert ALLE Nutzerdaten aus dem Ergebniss-Ordner 
 */
async function getUpdatedAll() {
  lostArr = [[],[]]
  readArr = [[],[]]
  dirtyArr = [[],[]]
  const directoryItems = await client.getDirectoryContents("/")
  studData.length = directoryItems.length
  for (let i = 0; i < directoryItems.length; i++) {
      const tempName = directoryItems[i].filename
      let tempData = await client.getFileContents("/" + tempName, { format: "text" })
      tempData = JSON.parse(tempData)
      //Test für example Data
      //let tempData = testData
      try {
         lostArr[0] = lostArr[0].concat(tempData.lost[0])
         lostArr[1] = lostArr[1].concat(tempData.lost[1])
         readArr[0] = readArr[0].concat(tempData.read[0])
         readArr[1] = readArr[1].concat(tempData.read[1])
         dirtyArr[0] = dirtyArr[0].concat(tempData.dirty[0])
         dirtyArr[1] = dirtyArr[1].concat(tempData.dirty[1])
      } catch (error) {
          console.log(error)
      }
      studData[i]=tempData
  }
  createChart(0, timeSpan)
}

/**
 * Importiert nur Nutzerdaten aus dem Ergebniss-Ordner, die den Login-Daten des einzelnen Studenten zugeordnet werden können 
 */
async function getUpdatedSingle() {
      const tempData = JSON.parse(await client.getFileContents("/" + tag + ".json", { format: "text" }));
      //Test für example Data
      //let tempData = testData
      try {
        lostArr = [tempData.lost[0], tempData.lost[1]]
        readArr = [tempData.read[0], tempData.read[1]]
        dirtyArr = [tempData.dirty[0], tempData.dirty[1]]
      } catch (error) {
  }
  studData[0] = tempData
  createChart(0, timeSpan)
}

/**
 * Fügt die Ergebnisse zeilienweise in die Tabelle ein
 * @param {*} outputSpan    -   Die Position an der die Zeilen ausgegeben werden
 */
async function showContent(outputSpan) {
  const tbody = document.getElementsByTagName('tbody')[0];
  tbody.innerHTML='';
  let totalRuns = []
  for (let i = 0; i < studData.length; i++) {
      const aktRuns = studData[i];
      //Lost Update
      for(let j = 0; j<aktRuns.lost[0].length;j++){
        const newDate = (aktRuns.lost[0][j].split("-")[1].concat(".", aktRuns.lost[0][j].split("-")[0]))
        if(newDate.includes(filter)||("lost update".includes(filter))||("true".includes(filter))){
            totalRuns.push("Lost Update_True_"+newDate)
        }
      }
      for(let j = 0; j<aktRuns.lost[1].length;j++){
        const newDate = (aktRuns.lost[1][j].split("-")[1].concat(".", aktRuns.lost[1][j].split("-")[0]))
        if(newDate.includes(filter)||("lost update".includes(filter))||("false".includes(filter))){
            totalRuns.push("Lost Update_False_"+newDate)
        }
      }
      //Non-Repeatable Read
      for(let j = 0; j<aktRuns.read[0].length;j++){
        const newDate = (aktRuns.read[0][j].split("-")[1].concat(".", aktRuns.read[0][j].split("-")[0]))
        if(newDate.includes(filter)||("non-repeatable read".includes(filter))||("true".includes(filter))){
            totalRuns.push("Non-Repeatable Read_True_"+newDate)
        }
      }
      for(let j = 0; j<aktRuns.read[1].length;j++){
        const newDate = (aktRuns.read[1][j].split("-")[1].concat(".", aktRuns.read[1][j].split("-")[0]))
        if(newDate.includes(filter)||("non-repeatable read".includes(filter))||("false".includes(filter))){
            totalRuns.push("Non-Repeatable Read_False_"+newDate)
        }
      }
      //Dirty Read
      for(let j = 0; j<aktRuns.dirty[0].length;j++){
        const newDate = (aktRuns.dirty[0][j].split("-")[1].concat(".", aktRuns.dirty[0][j].split("-")[0]))
        if(newDate.includes(filter)||("dirty read".includes(filter))||("true".includes(filter))){
            totalRuns.push("Dirty Read_True_"+newDate)
        }
      }
      for(let j = 0; j<aktRuns.dirty[1].length;j++){
        const newDate = (aktRuns.dirty[1][j].split("-")[1].concat(".", aktRuns.dirty[1][j].split("-")[0]))
        if(newDate.includes(filter)||("dirty read".includes(filter))||("false".includes(filter))){
            totalRuns.push("Dirty Read_False_"+newDate)
        }
      }
  }

  
    totalRuns = sortCrit(totalRuns)
  
  for (let y = outputSpan; y<totalRuns.length&&y<outputSpan+tableSpan; y++){
        const tableRow = document.createElement("tr")
        const run = totalRuns[y].split("_")
        const s = `
        <td>${run[0]}</td>
        <td>${run[1]}</td>
        <td>${run[2]}</td>
        `
        tableRow.innerHTML = s;
        tbody.appendChild(tableRow)
}  
  tablePos = outputSpan
  total = totalRuns.length;
  document.querySelector('#totalAmount').innerHTML=`<b>Insgesamt ${total} Einträge</b>`
  createShownTable(tablePos, tableSpan)
  if((tablePos+tableSpan)<total){document.getElementById("nextTable").classList.remove('disabled')}
}

/**
 * Generiert die Werte für den Graphen
 * @param {*} outputSpan    -   Die Position an Duchläufen, die ausgegeben wird
 */
async function createChart(outputSpan, timeParam){
    const aktTime = new Date()
    const dateOffset = (24*60*60*1000)*timeParam

    aktTime.setTime(aktTime.getTime()-dateOffset)

    function filterFun(dateString){
        const tempDate = new Date("2023-"+dateString)
        if(tempDate >= aktTime){
            return true;
        }
        return false;
    }

    const filterLostArr = [lostArr[0].filter(element => filterFun(element)), lostArr[1].filter(element => filterFun(element))]
    const filterReadArr = [readArr[0].filter(element => filterFun(element)), readArr[1].filter(element => filterFun(element))]
    const filterDirtyArr = [dirtyArr[0].filter(element => filterFun(element)), dirtyArr[1].filter(element => filterFun(element))]

    const rArray = [filterLostArr[0].length, filterReadArr[0].length, filterDirtyArr[0].length];
    const wArray = [filterLostArr[1].length, filterReadArr[1].length, filterDirtyArr[1].length];

    plotChart(rArray, wArray) 
    pos = outputSpan 
}

/**
 * Navigationsfunktionen um die Tabellenansicht zu verändern
 */
async function changeNextTable(){
    if( !document.getElementById("nextTable").classList.contains('disabled')){
      showContent(tablePos+tableSpan)
      document.getElementById("prevTable").classList.remove('disabled')
      if(tablePos+tableSpan>=total){document.getElementById("nextTable").classList.add('disabled')}
      createShownTable(tablePos, tableSpan)
    }
}  
async function changePreviousTable(){
    if(!document.getElementById("prevTable").classList.contains('disabled')){
      showContent(tablePos-tableSpan)
      document.getElementById("nextTable").classList.remove('disabled')
    if(tablePos-tableSpan<0){document.getElementById("prevTable").classList.add('disabled')}
      createShownTable(tablePos, tableSpan)
    }
}

/**
 * Fügt die Navigationsleiste für die Tabelle ein
 * @param {*} akt   -   Aktuelle Position der Anzeige   
 * @param {*} range -   Reichweite der Anzeige
 */
async function createShownTable(akt, range){
    const shown = document.getElementById('routeTable')
    shown.innerHTML = '<a class="page-link">'+(akt+1)+" bis "+Math.min((akt+range), total)+'</a>'
}

/**
 * Button um die Anzeige des Graphen zu togglen
 */
async function toggleGraphSetting(){
    graphSetting = !graphSetting;
    if(graphSetting){
        document.getElementById("switchGraphMode").innerHTML = "Total"
    }else{
        document.getElementById("switchGraphMode").innerHTML = "Prozent"
    }
    createChart(pos, timeSpan)
}

async function toggleDropDown(){
    const x = document.querySelector('.dropdown-menu')
    if(x.style.display == "none"){
        x.style.display = "block"
    }else{
        x.style.display = "none"
    }
}

async function execDropDown(timeValue){
    document.querySelector('.dropdown-menu').style = "display:none" 
    timeSpan = timeValue
    createChart(pos, timeSpan)
    selector = 'timeAll'
    switch (timeValue){
        case 365:
            selector = 'timeAll'
            break;
        case 30:
            selector = 'timeThirty'
            break;
        case 7:
            selector = 'timeSeven'
            break;
    } 
    document.querySelector('#dropdownbtn').innerHTML = document.querySelector('#'+selector).innerHTML
}

/**
 * Erstellt den Highcharts Graph für die Anzeige
 * @param {*} keyArray Array mit allen relevanten Ergebnissen 
 * @param {*} rightArray Array mit allen richtigen Ergebnissen 
 * @param {*} wrongArray Array mit allen falschen Ergebnissen 
 **/
function plotChart(rightArray, wrongArray) {
    let stack = "normal"
    let yText = "Ergebnisse Total"
    if(graphSetting){
        stack = "percent"
        yText = 'Ergebnisse in Prozent'
    }

  Highcharts.chart('graph1', {
      chart: {
          type: 'column'
      },
      title: {
          text: 'Phrasen Ergebnisse'
      },
      xAxis: {
          categories: ["Lost Update", "Non-Repeatable Read", "Dirty Read"],
          labels: {
            
          }
      },
      yAxis: {
          min: 0,
          title: {
              text: `${yText}`
          }
      },
      tooltip: {
          pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
          shared: true
      },
      plotOptions: {
          column: {
              stacking: `${stack}`,
              events: {
                 click: function(oEvent){
                    if(tableShow){
                        callPopup(oEvent.point.x+pos)
                    }else{
                        startTrainer(phrases[oEvent.point.x+pos])
                    }
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


/**
 * Fügt den Listener für die suchfunktion der Tabelle hinzu
 */
async function searchListener(){
    const input = document.querySelector("[data-search]");

    input.addEventListener("input", e => {
        filter = e.target.value.toLowerCase()
        showContent(0)
    });
}

/**
 * Sortiert den Array an Ergebnissen
 * @param {*} arr Array mit den gesammten Ergebnissen
 */
function sortCrit(arr){

    return arr.sort(compare)

    function compare(a, b){
        const day1 = parseInt(a.split("_")[2].split(".")[0])
        const month1 = parseInt(a.split("_")[2].split(".")[1])
        const day2 = parseInt(b.split("_")[2].split(".")[0])
        const month2 = parseInt(b.split("_")[2].split(".")[1])

        if(month1>month2){
            return -1
        }
        if(month1<month2){
            return 1
        }
        if(day1>day2){
            return -1
        }
        if(day1<day2){
            return 1
        }
        return 0;
    }
}

