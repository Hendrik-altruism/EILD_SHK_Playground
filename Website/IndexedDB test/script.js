/*
const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webKitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

const request = indexedDB.open("CarsDatabase", 1);
*/
// 1
const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

if (!indexedDB) {
  console.log("IndexedDB could not be found in this browser.");
}

// 2
const request = indexedDB.open("CarsDatabase", 1);

request.onerror = function (event) {
    console.error("An error has occured with IndexedDB");
    console.error(event);
};

request.onupgradeneeded = function () {
    //1
    const db = request.result;
  
    //2
    const store = db.createObjectStore("cars", { keyPath: "id" });
  
    //3
    store.createIndex("cars_colour", ["colour"], { unique: false });
  
    // 4
    store.createIndex("colour_and_make", ["colour", "make"], {
      unique: false,
    }); 
  };
/*
request.onupgradeneeded = function () {
    const db = request.result;
    const store = db.createObjectStore("cars", { keyPath: "id" });
    store.createIndex("cars_colour", ["colour"], { unique: false });
    store.createIndex("colour_and_make", ["colour", "make"], { unique: false });
};
*/
request.onsuccess = function () {
    console.log("Database opened successfully");
  
    const db = request.result;
  
    // 1
    const transaction = db.transaction("cars", "readwrite");
  
    //2
    const store = transaction.objectStore("cars");
    const colourIndex = store.index("cars_colour");
    const makeModelIndex = store.index("colour_and_make");
  
    //3
    store.put({ id: 1, colour: "Red", make: "Toyota" });
    store.put({ id: 2, colour: "Red", make: "Kia" });
    store.put({ id: 3, colour: "Blue", make: "Honda" });
    store.put({ id: 4, colour: "Silver", make: "Subaru" });
  
    //4
    const idQuery = store.get(4);
    const colourQuery = colourIndex.getAll(["Red"]);
    const colourMakeQuery = makeModelIndex.get(["Blue", "Honda"]);
  
    // 5
    idQuery.onsuccess = function () {
      console.log('idQuery', idQuery.result);
    };
    colourQuery.onsuccess = function () {
      console.log('colourQuery', colourQuery.result);
    };
    colourMakeQuery.onsuccess = function () {
      console.log('colourMakeQuery', colourMakeQuery.result);
    };
  
    // 6
    transaction.oncomplete = function () {
      db.close();
    };
  };

/*request.onsuccess = function () {
    const db = request.result;
    const transaction = db.transaction("cars", "readwrite");

    const store = transaction.objectStore("cars");
    const colourIndex = store.index("cars_colour");
    const makeModelIndex = store.index("colour_and_make");

    store.put({ id: 1, colour: "Red", make: "Toyota" });
    store.put({ id: 2, colour: "Red", make: "Kia" });
    store.put({ id: 3, colour: "Blue", make: "Honda" });
    store.put({ id: 4, colour: "Silver", make: "Subaru" });

    const idQuery = store.get(4);
    const colourQuery = colourIndex.getAll(["Red"]);
    const colourMakeQuery = makeModelIndex.get(["Blue", "Honda"]);

    idQuery.onsuccess = function () {
        console.log('idQuery', idQuery.result);
    };

    colourQuery.onsuccess = function () {
        console.log('colourQuery', colourQuery.result);
    };

    colourMakeQuery.onsuccess = function () {
        console.log('colourMakeQuery', colourMakeQuery.result);
    };

    transaction.oncomplete = function () {
        db.close();
    };
};
*/