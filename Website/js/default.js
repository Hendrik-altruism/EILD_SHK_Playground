var db=openDatabase("itemDB","1.0","itemDB",65535);



    $("#button1").click(function(){
        db.transaction(function(transaction){
            var sql="CREATE TABLE items "+
                "(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "+
                "item VARCHAR(100) NOT NULL, "+
                "quantity INT(5) NOT NULL)";
                transaction.executeSql(sql,undefined, function(){
                    alert("Table is created")
                },function(){
                    alert("Table already created");
                })
        });
    });





