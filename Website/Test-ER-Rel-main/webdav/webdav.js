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
const dataAll = false;

/**
 * URL zum WebDav-Ordner
 * @param {String} webDavLink   -   Ergebnisse werden zusätzlich in Tabellenform mit Suchfilter angezeigt
 */
const webDavLink = "https://lea.hochschule-bonn-rhein-sieg.de/webdav.php/db_040811/ref_1325238/";


//Globale Variablen
window.webdav = true;       //Setzt die globale Webdav Variable
let phrases = [];           //Phrasen -> werden beim Start gesetzt
let tag;                    //Tag des Nutzenden Studenten
let client;                 //Eingeloggter Client in der Webdav-Verbindung
let studData = {};          //Komplette Daten des/der Studenten              
let timeSpan = 365;         //Zeitspanne in Tagen, in der die Daten angezeigt werden    
let pos = 0;                //Anzeige-Position des Graphen
const span = 25;            //Spanne der angezeigten Phrasen im Graphen
let tablePos = 0;           //Anzeige-Position der Tabelle
const tableSpan = 10;       //Spanne der angezeigten  im Graphen
let total = 0;              //Länge der bearbeiteten Phrasen
let filter = "";            //Filtereinstellung für die Suchfunktion
const keys = new Array();   //Array mit der Schlüsseln der Durchläufe

//Testdaten für dei Entwicklung
const testData = {
    Patient_Patientenakte_1_1: [
        ["2023-2-23", "2023-2-11", "2023-3-7", "2023-3-11", "2023-3-11"],
        ["2023-2-2", "2023-3-6", "2023-3-7", "2023-3-11"], 
    ],
    Vater_Mutter_Kind_n_n_1: [
        ["2023-1-2", "2023-4-6", "2023-4-7", "2023-4-11"],
        ["2023-1-11", "2023-2-5", "2023-3-7", "2023-4-11", "2023-4-11"]  
    ],
    Hund_Schäferhund_Mops_Dackel_p_n: [
        ["2023-2-11", "2023-2-11", "2023-3-11", "2023-3-11", "2023-3-11", "2023-3-11"],
        ["2023-2-2", "2023-3-6", "2023-3-11"]
    ],
    Patient_Akte_1_1: [
        ["2023-1-2", "2023-3-7", "2023-3-11"],
        ["2023-1-11", "2023-3-11"]
    ],
}


//Das erste Popup für den Login wird gerendert
createPopup();


/**
 * Fügt den ModalDialog in die Webseite ein
 */
async function createPopup(){
    let m = `
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
    document.getElementById("er_rel_trainer-1").insertAdjacentHTML("afterend", m)
}

/**
 * Ändert den Modaldialog, sodass die Nutzerdaten dort angezeigt werden können
 */
async function userDataPlot(){
    document.getElementById("myModal").innerHTML = ''
    let dataPop = `
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
        //initCon(document.getElementById("StudData"), document.getElementById("StudPw"))  
        //call();
    }
    catch(err){
        document.getElementById("errorMessage").style.display = "block";
        document.getElementById("StudPw").value="";
        return false;
    }
    checkOutdated()
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
        client.putFileContents("/" + tag + ".json", "{}")
    }
}  

/**
 * Fügt einen Durchlauf in die JSON-Datei des Nutzers ein
 * @param {*} file          -   Vom Trainer generierte Datei mit Lösungsdaten
 * @param {String} dateKey  -   Vom Trainer generierter String mit Datum
 */
async function insertRun(file, dateKey) {
    if(file.results[file.results.length-2].hasOwnProperty('correct')){
        let data = JSON.parse(await client.getFileContents("/" + tag + ".json", { format: "text" })) 
      
        data[file.phrases[file.results.length-2].key][file.results[file.results.length-2].correct ? 0 : 1].push(dateKey)
        try{
            client.putFileContents("/" + tag + ".json", JSON.stringify(data))       
        } catch(error){
        }
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
                  <th>Phrase</th>
                  <th>Ergebniss</th>
                  <th>Datum</th>
              </tr>
          </thead>
          <tbody id="tbody">
          </tbody>
        </table>
        <div class="phraseContent borderBox">
            <div class="desHeader">
                <b>Beschreibung</b>
            </div>
            <div id="phraseContentDes">
            </div>
        </div>
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
  <ul class="pagination">
      <li id="prev" class="paginate_button page-item previous disabled" id="">
          <a onclick="changePrevious()" href="#" class="page-link">Vorherige</a>
      </li>
      <li id="route" class="paginate_button page-item active">
          <a class="page-link">0 bis 25</a>
      </li>
      <li id="next" class="paginate_button page-item previous disabled" id="">
          <a onclick="changeNext()" href="#" class="page-link">Nächste</a>
      </li>
  </ul>
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
    width: 60%;
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

  .phraseContent{
      width: 40%;
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
  if(!dataAll){
    await getUpdatedSingle();
  }else{
    await getUpdatedAll();
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
  for(i = 1; i<=phrases.length; i++){
    keys[i-1]=i
    }
  const directoryItems = await client.getDirectoryContents("/")
  for (let i = 0; i < directoryItems.length; i++) {
      const tempName = directoryItems[i].filename
      let tempData = JSON.parse(await client.getFileContents("/" + tempName, { format: "text" }));

      for (const [key, value] of Object.entries(tempData)){
        studData[key][0]=studData[key][0].concat(value[0])
        studData[key][1]=studData[key][1].concat(value[1])
    }
  }
  createChart(0, timeSpan)
  createShown(pos, span)
  if(pos+span<keys.length){document.getElementById("next").classList.remove('disabled')}
}

/**
 * Importiert nur Nutzerdaten aus dem Ergebniss-Ordner, die den Login-Daten des einzelnen Studenten zugeordnet werden können 
 */
async function getUpdatedSingle() {
    for(i = 1; i<=phrases.length; i++){
      keys[i-1]=i
    }
    //let tempData = await client.getFileContents("/" + tag + ".json", { format: "text" });
    //tempData = JSON.parse(tempData)
    //Test für example Data
    tempData = testData
    for (const [key, value] of Object.entries(tempData)){
        studData[key][0]=studData[key][0].concat(value[0])
        studData[key][1]=studData[key][1].concat(value[1])
    }
    createChart(0, timeSpan)
    createShown(pos, span)
    if(pos+span<keys.length){document.getElementById("next").classList.remove('disabled')}
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
      for(let j = 0; j<aktRuns.length;j++){
          if(aktRuns[j].key.toString().includes(filter)||aktRuns[j].correct.toString().includes(filter)){
            totalRuns.push(aktRuns[j])
          }
      }
  }
  for (let y = outputSpan; y<totalRuns.length&&y<outputSpan+tableSpan; y++){
        const tableRow = document.createElement("tr")
        const run = totalRuns[y]
        const decKey = run.key-1
        const s = `
        <td><a href="javascript:callPopup(${decKey})" class="tableLinks">${run.key}</a></td>
        <td>${run.correct}</td>
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
        const tempDate = new Date(dateString)
        if(tempDate >= aktTime){
            return true;
        }
        return false;
    }

    kArray = new Array();
    rArray = new Array();
    wArray = new Array();
    let index = 0
    for (const [key, value] of Object.entries(studData)) {
        kArray[index]=index+1
        
        const rFinal = value[0].filter(element => filterFun(element))
        const lFinal = value[1].filter(element => filterFun(element))
        
        rArray[decript(key)-1]=rFinal.length
        wArray[decript(key)-1]=lFinal.length
        index++
    }

kArray = kArray.slice(outputSpan, span+outputSpan)
rArray = rArray.slice(outputSpan, span+outputSpan)
wArray = wArray.slice(outputSpan, span+outputSpan)

plotChart(kArray, rArray, wArray) 
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

/**
 * Navigationsfunktionen um Ansicht des Graphen zu verändern
 */
async function changeNext(){
    if( !document.getElementById("next").classList.contains('disabled')){
        createChart(pos+span, timeSpan)
        document.getElementById("prev").classList.remove('disabled')
        if(pos+span>=keys.length){document.getElementById("next").classList.add('disabled')}
        createShown(pos, span)
    }
}
async function changePrevious(){
    if(!document.getElementById("prev").classList.contains('disabled')){
        createChart(pos-span, timeSpan)
        document.getElementById("next").classList.remove('disabled')
        if(pos-span<0){document.getElementById("prev").classList.add('disabled')}
        createShown(pos, span)
    }
}

/**
 * Fügt die Navigationsleiste für den Graphen ein
 * @param {*} akt   -   Aktuelle Position der Anzeige   
 * @param {*} range -   Reichweite der Anzeige
 */
async function createShown(akt, range){
const shown = document.getElementById('route')
shown.innerHTML = '<a class="page-link">'+(akt+1)+" bis "+Math.min((akt+range), phrases.length)+'</a>'
}


/**
 * Wandelt den Schlüssel zurück zur jeweiligen Phrase um
 * @param {*} skey den generierten Schlüssel
 * @returns {nkey} ein Schlüssel für eine Phrase
 */
function decript(skey){
  if(typeof skey === "number"){
      return skey;
  }
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

/**
 * Erstellt den Highcharts Graph für die Anzeige
 * @param {*} keyArray Array mit allen relevanten Ergebnissen 
 * @param {*} rightArray Array mit allen richtigen Ergebnissen 
 * @param {*} wrongArray Array mit allen falschen Ergebnissen 
 **/
function plotChart(keyArray, rightArray, wrongArray) {
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
          categories: keyArray,
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
 * Roft das Popup für die angeklickte Phrase auf
 * @param {*} phraseID  -   ID der angeclickten Phrase
 */
function callPopup(phraseID){
document.querySelector('.desHeader').innerHTML = "<b>Beschreibung Phrase: "+ (phraseID+1)+ "</b>"
let phrase = phrases[phraseID]
let p = '<div class="DataField"><span class="identifier">Text: </span><span class="variable">'+phrase.text.toString()+'</span></div>'  
p+= '<div class="DataField"><span class="identifier">Entitäten: </span><span class="variable">'+phrase.entities.toString()+'</span></div>'
if(phrase.hasOwnProperty('relation')){
p+= '<div class="DataField"><span class="identifier">Relation: </span><span class="variable">'+phrase.relation.toString()+'</span></div>'
} else {
  p+= '<div class="DataField"><span class="identifier">Relation: </span><span class="variable">ist</span></div>'
}
p+= '<div class="DataField"><span class="identifier">Lösung: </span><span class="variable">'+phrase.solution.toString()+'</span></div>'
p+= '<div class="DataField"><span class="identifier">Kommentare: </span><span class="variable">'+phrase.comments.toString()+'</span></div>'
p+= '<div class="button-container"><button class="btn btn-primary phrase-btn">Phrase Bearbeiten</button></div>'
document.getElementById('phraseContentDes').innerHTML = p
document.querySelector('.phrase-btn').addEventListener('click', () => startTrainer(phrase))
}

/**
 * Startet den Trainer im Modal-Dialog zur bearbeitung einer bestimmten Phrase
 * @param {*} phrase    -   Phrase mit welcher der Trainer gestartet wird 
 */
async function startTrainer(phrase){
    ccm.start(".../ccm.er_rel_trainer.js", {
        root: document.querySelector('.modal-body'),
        phrases: [phrase],
        html: [ "ccm.load", { "url": "./webdav/valueCollection/resources/custom.js", "type": "module" } ],
        onfinish: async (event, instance)=>{
            const result = instance.getValue();
            const phrase = result.phrases[0];
            
            phrase.key = phrase.entities.concat(phrase.solution).join('_');
            
            /*
            if(result.results[0].hasOwnProperty('correct')){
                const run = {
                    correct: result.results[0].correct,
                    key: phrase.key,
                }
                let data = JSON.parse(await client.getFileContents("/" + tag + ".json", { format: "text" }))    
                data.push(run)
                try{
                    client.putFileContents("/" + tag + ".json", JSON.stringify(data))       
                } catch(error){
                }
            } */

            document.querySelector('.modal-body').innerHTML = await generateGraphTemplate();
            await fillTemplate();
        }
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
 * Setzt die Phrasen, nach start des Trainers
 * @param {*} p -   Array an Phrasen
 */
function setPhrases(p){
    phrases = p;
    getKeys().forEach(element => {
        studData[element] = [[],[]];
    })
}

/**
 * Hilfsfuntktion um die eindeutigen Keys der Phrasen zu generieren 
 * @returns {Array}     -   Array an generierten Keys aus den Phrasen
 */
function getKeys(){
    const result = [];
    phrases.forEach(element => {
       result.push(element.entities.concat(element.solution).join('_'))
    })
    return result
}

/**
 * Löscht die Daten von Phrasen, die sich nicht mehr im Trainer befinden
 * @param {String} fileName -   Name der Datei die bereinigt werden soll 
 */
async function checkOutdated(fileName = tag){
    //Testdaten zur Überprüfung der Methode
    const localData = testData
    //const localData = JSON.parse(await client.getFileContents("/" + fileName + ".json", { format: "text" }))
    const genKeys = getKeys();

    for (const key in localData){
        if (!genKeys.includes(key)){
            delete localData[key]
        }
    }
    genKeys.forEach(element =>{
        if (!localData.hasOwnProperty(element)){
            localData[element] = [[], []]
        }
    })
    //client.putFileContents("/" + fileName + ".json", JSON.stringify(localData))
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
    let selector = 'timeAll'
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