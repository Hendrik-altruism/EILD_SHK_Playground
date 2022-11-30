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
for(i = 1; i<=47; i++){
db.runs.add({id: i, studTag: "houde2s", correct: true, key: i })
}

async function login() {
    tag = document.getElementById("StudData").value
    //await initCon(tag, document.getElementById("StudPw"))
    document.querySelector(".popup").style.display = "none";
    //await getUpdated()
    await showContent(50)
    $('#example').DataTable();
}

//Intialization of the user Connection with console log aon completion
async function initCon(User, Pw) {
    client = window.WebDAV.createClient("https://lea.hochschule-bonn-rhein-sieg.de/webdav.php/db_040811/ref_1263132/", {
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
    for (var i = 1; i < directoryItems.length; i++) {
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
const phrases = [
    {
      "text": "Im Krankenhaus gibt es zu jedem Patienten eine Patientenakte.",
      "entities": ["Patient", "Patientenakte"],
      "relation": "hat",
      "solution": ["1", "1"],
      "comments": [
        "Zu jedem Patienten gibt es genau eine Patientenakte.",
        "Zu jeder Patientenakte gibt es genau einen Patienten."
      ]
    },
    {
      "text": "Im Chemielabor werden die Atomkerne von Atomen untersucht.",
      "entities": ["Atom", "Atomkern"],
      "relation": "hat",
      "solution": ["1", "1"],
      "comments": [
        "Jedes Atom hat genau einen Atomkern.",
        "Jeder Atomkern gehört zu genau einem Atom."
      ]
    },
    {
      "text": "Auf einer Konferenz sollen die Teilnehmer die Möglichkeit haben beim Einlass ein Namensschild zu bekommen.",
      "entities": ["Namensschild", "Teilnehmer"],
      "relation": "gehört zu",
      "solution": ["1", "c"],
      "comments": [
        "Jedes Namensschild gehört zu genau einem Teilnehmer.",
        "Ein Teilnehmer hat ein oder kein Namensschild."
      ]
    },
    {
      "text": "Bei einer Verkehrssimulation soll ein Fahrzeug auch einen Anhänger haben können.",
      "entities": ["Anhänger", "Fahrzeug"],
      "relation": "gehört zu",
      "solution": ["1", "c"],
      "comments": [
        "Ein Anhänger gehört zu genau einem Fahrzeug.",
        "Ein Fahrzeug hat einen oder keinen Anhänger."
      ]
    },
    {
      "text": "Für eine Stadtverwaltung soll es möglich sein auch eventuelle Bahnhöfe einer Stadt zu erfassen.",
      "entities": ["Bahnhof", "Stadt"],
      "relation": "gehört zu",
      "solution": ["1", "cn"],
      "comments": [
        "Ein Bahnhof gehört zu genau einer Stadt.",
        "Eine Stadt hat keinen, einen oder mehrere Bahnhöfe."
      ]
    },
    {
      "text": "Ein Hausbesitzer möchte erfassen, wer gerade in seinen beiden Häusern wohnt.",
      "entities": ["Bewohner", "Haus"],
      "relation": "wohnt in",
      "solution": ["1", "cn"],
      "comments": [
        "Ein Bewohner wohnt in genau einem Haus.",
        "Ein Haus hat keinen, einen oder mehrere Bewohner."
      ]
    },
    {
      "text": "Das Vereinswesen in Deutschland möchte eine Liste aller Vereine verwalten. Zu jedem Verein soll auch eine Kontaktperson eingetragen sein, wobei manche Vereine die gleiche Kontaktperson angeben.",
      "entities": ["Verein", "Kontaktperson"],
      "relation": "hat",
      "solution": ["1", "n"],
      "comments": [
        "Ein Verein hat genau eine Kontaktperson.",
        "Eine eingetragene Kontaktperson gehört zu mindestens einem Verein."
      ]
    },
    {
      "text": "Ein Radiosender für klassische Musik möchte eine Datensammlung von Musikstücken aufbauen, wobei für jedes Musikstück auch Hintergrundinformationen zum Komponisten abrufbar sein sollen.",
      "entities": ["Musikstück", "Komponist"],
      "relation": "hat",
      "solution": ["1", "n"],
      "comments": [
        "Ein Musikstück hat genau einen Komponisten.",
        "Zu jedem Komponisten in der Datensammlung gibt es mindestens ein Musikstück."
      ]
    },
    {
      "text": "Eine Mensa möchte ihren Bestand an Töpfen (inkl. Pfannen) nachhalten, um schneller festzustellen, ob etwas fehlt und nachgekauft werden muss. Die Deckel sollen separat erfasst werden, da diese auch einzeln nachbestellbar sind. Zu jedem Topf gibt es einen Deckel, es gibt allerdings auch Töpfe ohne Deckel (z.B. Wok).",
      "entities": ["Topf", "Deckel"],
      "relation": "hat",
      "solution": ["c", "1"],
      "comments": [
        "Ein Topf hat einen oder keinen Deckel.",
        "Ein Deckel gehört zu genau einem Topf."
      ]
    },
    {
      "text": "Bei der Bauplanung eines Mehrfamilienhauses soll für einen entsprechenden Aufpreis auch ein Fahrstuhl möglich sein.",
      "entities": ["Haus", "Aufzug"],
      "relation": "hat",
      "solution": ["c", "1"],
      "comments": [
        "Ein Haus hat einen oder keinen Aufzug.",
        "Ein Aufzug gehört zu genau einem Haus."
      ]
    },
    {
      "text": "Bei der Genforschung werden Chromosome und deren spezifische Merkmale untersucht, wobei sich während der Studie ein X-Chromosom mit einem X- oder Y-Chromosom verbinden kann und ein Y-Chromosom nur mit einem X-Chromosom.",
      "entities": ["X-Chromosom", "Y-Chromosom"],
      "relation": "verbunden",
      "solution": ["c", "c"],
      "comments": [
        "Ein X-Chromosom ist mit einem oder keinem Y-Chromosom verbunden.",
        "Ein Y-Chromosom ist mit einem oder keinem X-Chromosom verbunden."
      ]
    },
    {
      "text": "Beim Standesamt wird verwaltet, welche Personen gerade miteinander verheiratet sind.",
      "entities": ["Person", "Person"],
      "relation": "verheiratet",
      "solution": ["c", "c"],
      "comments": [
        "Eine Person kann höchstens mit einer anderen Person verheiratet sein.",
        "Eine Person kann höchstens mit einer anderen Person verheiratet sein.",
      ]
    },
    {
      "text": "Bei einem Winzer gehört eine Weinflasche zu einer Weinsorte oder ist selbstgebraut.",
      "entities": ["Weinflasche", "Weinsorte"],
      "relation": "gehört zu",
      "solution": ["c", "cn"],
      "comments": [
        "Eine Weinflasche gehört zu genau einer oder keiner Weinsorte.",
        "Von einer Weinsorte hat ein Winzer entweder keine, eine oder mehrere Weinflaschen."
      ]
    },
    {
      "text": "Bei der Insektenforschung soll festgehalten werden, ob die Insekten im Labor Flügel haben oder nicht.",
      "entities": ["Insekt", "Flügel"],
      "relation": "hat",
      "solution": ["c", "cn"],
      "comments": [
        "Ein Insekt hat entweder Flügel oder keine Flügel.",
        "Im Labor gibt es kein, ein oder mehrere Insekten mit Flügeln."
      ]
    },
    {
      "text": "Der deutsche Staat möchte transparent machen, welcher Bürger welcher Partei angehört.",
      "entities": ["Bürger", "Partei"],
      "relation": "ist Mitglied in",
      "solution": ["c", "n"],
      "comments": [
        "Ein Bürger kann nur Mitglied in maximal einer Partei gleichzeitig sein.",
        "Eine Partei hat eine Mindestzahl an Mitgliedern."
      ]
    },
    {
      "text": "Bei einer Schiffssimulation soll protokolliert werden, ob und wie häufig ein Schiff unter einer bestimmten Flagge segelt. Zu diesem Zweck sollen nun auch Flaggen im System als eigene Entität verwaltet werden.",
      "entities": ["Schiff", "Flagge"],
      "relation": "segelt unter",
      "solution": ["c", "n"],
      "comments": [
        "Ein Schiff kann immer nur unter maximal einer Flagge gleichzeitig segeln.",
        "Eine protokollierte Flagge wurde von mindestens einem Schiff genutzt."
      ]
    },
    {
      "text": "Bei einer Weltraumsimulation kann ein Planet Monde haben, die ihn umkreisen.",
      "entities": ["Planet", "Mond"],
      "relation": "hat",
      "solution": ["cn", "1"],
      "comments": [
        "Ein Planet hat keinen, einen oder mehrere Monde.",
        "Ein Mond gehört immer zu genau einem Planeten."
      ]
    },
    {
      "text": "Der öffentliche Dienst möchte seine aktuell an Firmen vergebenen Aufträge verwalten.",
      "entities": ["Firma", "Auftrag"],
      "relation": "hat",
      "solution": ["cn", "1"],
      "comments": [
        "Eine Firma hat aktuell keinen, einen oder mehrere Aufträge.",
        "Ein vergebener Auftrag gehört zu genau einer Firma."
      ]
    },
    {
      "text": "In einem Point-and-Click-Adventure soll die Spielfigur ein Inventar für gesammelte Gegenstände haben.",
      "entities": ["Inventar", "Gegenstand"],
      "relation": "enthält",
      "solution": ["cn", "c"],
      "comments": [
        "Im Inventar sind kein, ein oder mehrere Gegenstände enthalten.",
        "Ein Gegenstand ist im Inventar entweder enthalten oder nicht."
      ]
    },
    {
      "text": "In einem Projektmanagement-Tool sollen Aufgaben einem Mitarbeiter hauptverantwortlich zugewiesen werden können.",
      "entities": ["Mitarbeiter", "Aufgabe"],
      "relation": "ist zuständig für",
      "solution": ["cn", "c"],
      "comments": [
        "Ein Mitarbeiter ist zuständig für keine, eine, oder mehrere Aufgaben.",
        "Eine Aufgabe kann maximal einem Mitarbeiter hauptverantwortlich zugewiesen sein."
      ]
    },
    {
      "text": "Bei einem Onlinehändler sollen Kunden Produkte bestellen und sich vorab schon Registrieren können.",
      "entities": ["Kunde", "Produkt"],
      "relation": "bestellt",
      "solution": ["cn", "cn"],
      "comments": [
        "Ein Kunde hat kein, ein oder mehrere Produkte bestellt.",
        "Ein Produkt wurde von keinem, einem oder mehreren Kunden bestellt."
      ]
    },
    {
      "text": "Im neuen Gesundheitszentrum soll am Ende jedes Kurses jeder Teilnehmer eine vorab vorbereitete Teilnahmebescheinigung erhalten.",
      "entities": ["Teilnehmer", "Bescheinigung"],
      "relation": "erhalten",
      "solution": ["cn", "cn"],
      "comments": [
        "Ein Teilnehmer hat keine, eine oder mehrere Teilnahmebescheinigungen erhalten.",
        "Eine Bescheinigung wurde entweder noch gar nicht, einmal oder mehrmals an Teilnehmer ausgestellt."
      ]
    },
    {
      "text": "In einer neuen Hochschule sollen nun Studenten Lehrveranstaltungen besuchen und am Ende des Semesters von einem Professor geprüft werden.",
      "entities": ["Student", "Professor", "Lehrveranstaltung"],
      "relation": "wird geprüft",
      "solution": ["cn", "cn", "cn"],
      "comments": [
        "Ein Student wurde entweder noch gar nicht, einmal oder bereits mehrmals geprüft.",
        "Ein Professor hat entwerder noch gar nicht, einmal oder bereits mehrmals geprüft.",
        "In einer Lehrveranstaltung wurde noch gar nicht, einmal oder bereits mehrmals geprüft."
      ]
    },
    {
      "text": "Eine Fluggesellschaft möchte protokollieren, welche Piloten mit welchen Flugzeugen auf welchen Flugrouten eingesetzt werden. Bisher wurden im System nur Piloten und Flugzeuge verwaltet.",
      "entities": ["Pilot", "Flugzeug", "Flugroute"],
      "relation": "eingesetzt",
      "solution": ["cn", "cn", "n"],
      "comments": [
        "Ein Pilot wurde bisher gar nicht, einmal oder mehrmals mit einem Flugzeug auf einer Flugroute eingesetzt.",
        "Ein Flugzeug wurde bisher gar nicht, einmal oder mehrmals von einem Piloten auf einer Flugroute eingesetzt.",
        "Eine protokollierte Flugroute wurde mindestens einmal von einem Piloten mit einem Flugzeug bedient."
      ]
    },
    {
      "text": "Es soll protokolliert werden, welche Veranstaltung an welcher Location mit welchen Teilnehmern mit welchen Sponsoren stattgefunden hat. Bisher wurden im System nur die Veranstaltungen und ihre Locations verwaltet.",
      "entities": ["Veranstaltung", "Location", "Teilnehmer", "Sponsor"],
      "relation": "findet statt",
      "solution": ["cn", "cn", "n", "n"],
      "comments": [
        "Eine Veranstaltung wurde bisher gar nicht, einmal oder bereits mehrmals protokolliert.",
        "Eine Location wurde bisher gar nicht, einmal oder bereits mehrmals protokolliert.",
        "Ein protokollierter Teilnehmer hat mindestens an einer Veranstaltung teilgenommen.",
        "Ein protokollierter Sponsor hat sich an mindestens einer Veranstaltung beteiligt."
      ]
    },
    {
      "text": "In einem Sprachenzentrum soll gespeichert werden, welche der zu unterrichtenden Sprachen von welchen Dozenten gesprochen werden. Jeder Dozent beherrscht mindestens eine der Sprachen, zeitweise kann es aber passieren, dass es zu einer Sprachen keinen Dozenten gibt.",
      "entities": ["Sprache", "Dozent"],
      "relation": "gesprochen von",
      "solution": ["cn", "n"],
      "comments": [
        "Eine Sprache wird von keinem, einem oder mehreren Dozenten gesprochen.",
        "Ein Dozent beherrscht mindestens eine der zu unterrichtenden Sprachen."
      ]
    },
    {
      "text": "Beim Einwohnermeldeamt muss jeder Bürger seinen Wohnsitz anmelden. Obdachlose werden als 'ohne festen Wohnsitz' geführt und es können neben dem Hauptwohnsitz auch weitere Nebenwohnsitze gemeldet werden.",
      "entities": ["Bürger", "Wohnsitz"],
      "relation": "meldet an",
      "solution": ["cn", "n"],
      "comments": [
        "Ein Bürger hat keinen, einen oder mehrere Wohnsitze.",
        "Zu einem gemeldeten Wohnsitz gibt es mindestens einen Bürger, der dort wohnhaft ist."
      ]
    },
    {
      "text": "Ein Team von Programmierern möchte den Quelltext ihrer Programme versionieren, so dass bei jedem Speichern von Änderungen automatisch eine neue Version vom Quelltext separat gespeichert wird.",
      "entities": ["Programmierer", "Quelltext", "Version"],
      "relation": "speichert",
      "solution": ["cn", "n", "1"],
      "comments": [
        "Ein Programmierer hat noch keine, eine oder bereits mehrere Versionen des Quelltexts gespeichert.",
        "Zu einem gespeicherten Quelltext gibt es mindestens eine Version und einen Programmierer.",
        "Zu einer Version gibt es genau einen zugehörigen Quelltext und Programmierer."
      ]
    },
    {
      "text": "Eine Bibliothek möchte die einzelnen Seiten ausgewählter Bücher digitalisieren.",
      "entities": ["Buch", "Seite"],
      "relation": "hat",
      "solution": ["n", "1"],
      "comments": [
        "Ein Buch hat mehrere Seiten.",
        "Eine Seite gehört zu genau einem Buch."
      ]
    },
    {
      "text": "Ein Architekt möchte wichtige Eckdaten zu den einzelnen individuellen Räumen seiner Gebäude verwalten.",
      "entities": ["Gebäude", "Raum"],
      "relation": "hat",
      "solution": ["n", "1"],
      "comments": [
        "Ein Gebäude hat mindestens einen Raum.",
        "Ein Raum gehört zu genau einem Gebäude."
      ]
    },
    {
      "text": "Für ein Unternehmen sollen die Mitarbieter verwaltet werden, wobei jeder Mitarbeiter genau einen Vorgesetzten und jeder Vorgesetzte mindestens einen Mitarbeiter haben soll.",
      "entities": ["Mitarbeiter", "Mitarbeiter"],
      "roles": ["Vorgesetzter", ""],
      "relation": "ist Chef von",
      "solution": ["n", "1"],
      "comments": [
        "Ein Vorgesetzter hat mindestens einen Mitarbeiter.",
        "Ein Mitarbeiter hat immer genau einen Vorgesetzten."
      ]
    },
    {
      "text": "Für ein Forschungsprojekt sollen in einem Landkreis alle Bäume und Wälder erfasst werden.",
      "entities": ["Wald", "Baum"],
      "relation": "hat",
      "solution": ["n", "c"],
      "comments": [
        "Ein Wald besteht aus mehreren Bäumen.",
        "Ein Baum muss nicht zwingend zu einem Wald gehören und gehört wenn dann immer nur zu genau einem Wald."
      ]
    },
    {
      "text": "Die Deutsche Post möchte bei der teilautomatisierten Briefverarbeitung den Absender eines Briefs erfassen.",
      "entities": ["Absender", "Brief"],
      "relation": "notiert auf",
      "solution": ["n", "c"],
      "comments": [
        "Ein erfasster Absender ist auf mindestens einem Brief notiert gewesen.",
        "Ein Brief enthält entweder einen oder keinen Absender."
      ]
    },
    {
      "text": "Für ein Restaurant sollen die aktuell verwendeten Rezepte und die vorhandenen Zutaten verwaltet werden.",
      "entities": ["Rezept", "Zutat"],
      "relation": "hat",
      "solution": ["n", "cn"],
      "comments": [
        "Ein Rezept hat immer mehrere Zutaten.",
        "Eine vorhandene Zutat wird in keinem, einem oder mehreren Rezepten verwendet."
      ]
    },
    {
      "text": "In einem App Store gibt es die Anforderung, dass für jede App mindestens eine von mehreren vordefinierten Kategorien angegeben werden muss.",
      "entities": ["App", "Kategorie"],
      "relation": "hat",
      "solution": ["n", "cn"],
      "comments": [
        "Für eine App muss mindestens eine Kategorie angegeben werden.",
        "Eine vordefinierte Kategorie wurde für keine, eine oder bereits für mehrere Apps angegeben."
      ]
    },
    {
      "text": "Ein Immobilienmakler möchte für seine verkauften Häuser die Kontaktdaten zu den neuen Eigentümern festhalten.",
      "entities": ["Haus", "Eigentümer"],
      "relation": "hat",
      "solution": ["n", "n"],
      "comments": [
        "Ein Haus hat mindestens einen Eigentümer.",
        "Ein Eigentümer hat mindestens ein Haus."
      ]
    },
    {
      "text": "Im Rahmen eines chemischen Experiments sollen ausgewählte Atome, ihre Elektronen und deren Bindungsfähigkeit untersucht werden.",
      "entities": ["Atom", "Elektron"],
      "relation": "hat",
      "solution": ["n", "n"],
      "comments": [
        "Ein Atom hat mindestens ein Elektron.",
        "Ein Elektron gehört zu einem oder mehreren Atomen (Elektronenpaarbindung)."
      ]
    },
    {
      "text": "Für die Erstellung eines Verkehrsplans muss verwaltet werden, welche Haltestellen miteinander verbunden sind.",
      "entities": ["Haltestelle", "Haltestelle"],
      "relation": "verbunden",
      "solution": ["cn", "cn"],
      "comments": [
        "Eine Haltestelle ist mit keiner, einer oder mehreren anderen Haltestelle verbunden.",
        "Eine Haltestelle ist mit keiner, einer oder mehreren anderen Haltestelle verbunden."
      ]
    },
    {
      "text": "Ein Kind hat eine (biologische) Mutter und einen (biologischen) Vater.",
      "entities": ["Vater", "Mutter", "Kind"],
      "relation": "hat",
      "solution": ["n", "n", "1"],
      "comments": [
        "Zu einem Vater gibt es genau eine Mutter und mindestens ein Kind.",
        "Zu einer Mutter gibt es genau einen Vater und mindestens ein Kind.",
        "Ein Kind hat genau eine Mutter und einen Vater."
      ]
    },
    {
      "text": "Ein Tierheim verwaltet Haustiere, die ein neues Zuhause suchen. Es handelt sich dabei vor allem um Hunde und Katzen.",
      "entities": ["Haustier", "Hund", "Katze"],
      "solution": ["p", "d"],
      "comments": [
        "Im Tierheim gibt es auch Haustiere, die weder Hund noch Katze sind.",
        "Es gibt keine Haustiere, die gleichzeitig Hund und Katze sind."
      ]
    },
    {
      "text": "Ein Versandhaus möchte verschiedene Paketdienstleister für die Zustellung ihrer Waren beauftragen. Pakete sollen vor allem über DHL, Hermes oder DPD versendet werden.",
      "entities": ["Paketdienstleister", "DHL", "Hermes", "DPD"],
      "solution": ["p", "d"],
      "comments": [
        "Aufträge können auch an andere Paketdienstleister vergeben werden (z.B. UPS).",
        "Ein Auftrag wird immer nur an einen Paketdienstleister vergeben."
      ]
    },
    {
      "text": "Verwaltet werden sollen die Besucher einer Gründermesse, auf der vor allem Unternehmensgründer und Sponsoren zusammenkommen.",
      "entities": ["Besucher", "Gründer", "Sponsor"],
      "solution": ["p", "n"],
      "comments": [
        "Neben Gründer und Sponsoren können auch andere Personengruppen (z.B. Ideengeber) die Messe besuchen.",
        "Ein Gründer kann auch gleichzeitig ein Sponsor und ein Sponsor selbst auch ein Gründer sein."
      ]
    },
    {
      "text": "Für eine Hundeshow sollen die teilnehmenden Hunde verwaltet werden. Zur Zeit sind vor allem Schäferhund, Mops und Dackel im Trend.",
      "entities": ["Hund", "Schäferhund", "Mops", "Dackel"],
      "solution": ["p", "n"],
      "comments": [
        "An der Hundeshow nehmen auch andere Hunderassen teil.",
        "Neben den reinrassigen Hunden nehmen auch Mischlinge teil (z.B. ein Mops-Dackel-Mix)."
      ]
    },
    {
      "text": "Eine Adoptionsvermittlungsstelle möchte die Kontaktdaten der (biologischen) Eltern verwalten. Dabei sollen auch Vater- und Mutter-spezifische Merkmale erfasst und deshalb explizit zwischen beiden unterschieden werden.",
      "entities": ["Elternteil", "Mutter", "Vater"],
      "solution": ["t", "d"],
      "comments": [
        "Ein (biologischer) Elternteil ist entweder Mutter oder Vater.",
        "Ein Elternteil kann nicht gleichzeitig Vater und Mutter sein."
      ]
    },
    {
      "text": "Auf dem schnurlosen Haustelefon soll es im Adressbuch grundsätzlich drei Kategorien von Einträgen mit spezifischen Merkmalen geben: Privat, Arbeit und Mobil. Jeder Eintrag muss einer dieser Kategorien zugeordnet werden.",
      "entities": ["Adressbuch", "Privat", "Arbeit", "Mobil"],
      "solution": ["t", "d"],
      "comments": [
        "Jeder Adressbucheintrag muss einer der Kategorien zugeordnet werden.",
        "Ein Eintrag kann nur einer der Kategorien zugeordnet werden."
      ]
    },
    {
      "text": "An einer Hochschule soll zwischen zwei Personengruppen unterschieden werden. Es gibt Studenten und alle anderen zählen als Mitarbeiter.",
      "entities": ["Hochschulangehöriger", "Student", "Mitarbeiter"],
      "solution": ["t", "n"],
      "comments": [
        "Neben Studenten und Mitarbeitern gibt es keine anderen Personengruppen an der Hochschule.",
        "Ein Student kann gleichzeitig auch ein Mitarbeiter (studentische Hilfskraft) und ein Mitarbeiter auch Student sein."
      ]
    },
    {
      "text": "Für ein Krankenhaus sollen die verschiedenen Personengruppen verwaltet werden. Unterschieden wird dabei zwischen Besuchern, Patienten und Personal.",
      "entities": ["Person", "Besucher", "Patient", "Personal"],
      "solution": ["t", "n"],
      "comments": [
        "Im Krankenhaus gibt es nur Besucher, Patienten und Personal. Andere Personengruppen können nicht vorkommen.",
        "Eine Person kann auch mehreren Personengruppen angehören. Jemand vom Personal kann z.B. auch Patient oder Besucher sein."
      ]
    },
  ];

  createShown(pos, span)