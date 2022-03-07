//Web SQL

var db = openDatabase('mytasks', '1.0', 'My Tasks', 5*1024*1024);

function init(){
    db.transaction(function (tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS works (id integer primary key autoincrement, name text, description text)');
        });
    displayAll();
}

function drop(){
    db.transaction(function (tx){
        tx.executeSql('DROP TABLE works',[], displayAll);
    });
}

function displayAll(){
    db.transaction(function (tx){
        tx.executeSql('select * from works', [], function(tx, results){
            var n = results.rows.length;
            var s = '<table cellpadding="2" cellspacing="2" border="1">';
            s += '<tr><th>Id</th><th>Name</th><th>Description</th><th>Options</th></tr>'
            for(var i=0; i<n; i++){
                var work = results.rows.item(i);
                s += '<tr>';
                s += '<td>' + work.id + '</td>';
                s += '<td>' + work.name + '</td>';
                s += '<td>' + work.description + '</td>';
                s += '<td><a href="#" onclick="del('+ work.id +')">Delete</a> | <a href="#" onclick="edit('+ work.id +')">Edit</a></td>';
                s += '</tr>';
            }
            s += '</table>';
            document.getElementById('result').innerHTML = s;
        });
    });
}

function add(){
    db.transaction(function (tx){
        var name = document.getElementById('workName').value;
        var description = document.getElementById('description').value;
        tx.executeSql('insert into works(name, description) values(?, ?)', [name, description], displayAll());
    });
}

function del(id){
    db.transaction(function (tx){
        tx.executeSql('delete from works where id = ?', [id], displayAll());
    });
}

function edit(id){
    db.transaction(function (tx){              
        tx.executeSql('select * from works where id = ?', [id], function(tx, results){
            var work = results.rows.item(0);
            document.getElementById('id').value = work.id;
            document.getElementById('workName').value = work.name;
            document.getElementById('description').value = work.description;
        });
    });
}

function save(){
    db.transaction(function (tx){
        var id = document.getElementById('id').value;
        var name = document.getElementById('workName').value;
        var description = document.getElementById('description').value;
        tx.executeSql('update works set name = ?, description = ? where id = ?', [name, description, id], displayAll());
    });
}

//Local Storage

const storageInput = document.querySelector('.storage');
const text = document.querySelector('.text');
const button = document.querySelector('.button');
const storedInput = localStorage.getItem('textInput');

if(storedInput){
    text.textContent = storedInput;
}

storageInput.addEventListener('input', letter => {
    text.textContent = letter.target.value;
});

const saveToLocalStorage = () => {
    localStorage.setItem('textinput', text.textContent)
}

button.addEventListener('click', saveToLocalStorage)

//IndexedDB

let data = null
const btnCreateDB = document.getElementById("btnCreateDB")
const btnAddNote = document.getElementById("btnAddNote")
const btnViewNotes = document.getElementById("btnViewNotes")

btnCreateDB.addEventListener("click", createDB)
btnAddNote.addEventListener("click", addNote) 
btnViewNotes.addEventListener("click", viewNotes)

function viewNotes() {

    const tx = data.transaction("personal_notes","readonly")
    const pNotes = tx.objectStore("personal_notes")
    const request = pNotes.openCursor()
    request.onsuccess = e => {

        const cursor = e.target.result

        if (cursor) {
            alert(`Title: ${cursor.key} Text: ${cursor.value.text} `)
            //do something with the cursor
            cursor.continue()
        }
    }

}

function addNote() {

    const note = {
        title: "note" + Math.random(),
        text: "This is my note"
    }

    const tx = data.transaction("personal_notes", "readwrite")
    tx.onerror = e => alert( ` Error! ${e.target.error}  `)
    const pNotes = tx.objectStore("personal_notes")
    pNotes.add(note)
}

function createDB () {

    const dbName = document.getElementById("txtDB").value
    const dbVersion = document.getElementById("txtVersion").value

    const request = indexedDB.open(dbName,dbVersion)

        //on upgrade needed
        request.onupgradeneeded = e => {
            data = e.target.result
          
            const pNotes = data.createObjectStore("personal_notes", {keyPath: "title"})
            const todoNotes = data.createObjectStore("todo_notes", {keyPath: "title"})
           
           alert(`upgrade is called database name: ${data.name} version : ${data.version}`)

        }
        //on success 
        request.onsuccess = e => {
            data = e.target.result
            alert(`success is called database name: ${data.name} version : ${data.version}`)
        }
        //on error
        request.onerror = e => {
            alert(`error: ${e.target.error} was found `)
             
        }


}