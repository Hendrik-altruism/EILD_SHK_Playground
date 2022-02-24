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