

/*const client = window.WebDAV.createClient("https://lea.hochschule-bonn-rhein-sieg.de/webdav.php/db_040811/ref_1209729/", {
    authType: window.WebDAV.AuthType.Digest,
    maxContentLength: 100000000,
    username: "houde2s",
    password: "060501"
});

client.putFileContents("Upload/lost", "hahaha");

//
// Declare Database and pre-populate it
//

//const createDB = document.getElementById('btnCreateDB');

let db = new Dexie('exportSample');
db.version(1).stores({
    foos: 'id'
});
db.on('populate', () => {
    return db.foos.bulkAdd([
        {
            id: 1,
            foo: 'foo',
            date: new Date(), // Dates, Blobs, ArrayBuffers, etc are supported
        }, {
            id: 2,
            foo: 'bar',
        }
    ]);
}); */

let db = new Dexie('exportSample');
db.version(1).stores({
    friends: "++id, name, age"
});



function deleteNote() {

}

function add() {
    addNote().catch(err => console.error('' + err))
}

async function addNote() {
    const fName = document.getElementById('friendName')
    const fAge = document.getElementById('friendAge')
    const finalName = JSON.parse(JSON.stringify(fName))
    const finalAge = JSON.parse(JSON.stringify(fAge))
    await db.friends.add({
        name: document.getElementById('friendName'),
        age: document.getElementById('friendAge')
    })
}

//
// When document is ready, bind export/import funktions to HTML elements
//
document.addEventListener('DOMContentLoaded', () => {
    showContent().catch(err => console.error('' + err));
    const dropZoneDiv = document.getElementById('dropzone');
    const exportLink = document.getElementById('exportLink');

    // Configure exportLink
    exportLink.onclick = async () => {
        try {
            const blob = await db.export({ prettyJson: true, progressCallback });
            download(blob, "dexie-export.json", "application/json");
        } catch (error) {
            console.error('' + error);
        }
    };


    // Configure dropZoneDiv
    dropZoneDiv.ondragover = event => {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    };

    // Handle file drop:
    dropZoneDiv.ondrop = async ev => {
        ev.stopPropagation();
        ev.preventDefault();

        // Pick the File from the drop event (a File is also a Blob):
        const file = ev.dataTransfer.files[0];
        try {
            if (!file) throw new Error(`Only files can be dropped here`);
            console.log("Importing " + file.name);
            await db.delete();
            db = await Dexie.import(file, {
                progressCallback
            });
            console.log("Import complete");
            await showContent();
        } catch (error) {
            console.error('' + error);
        }
    }
});

function progressCallback({ totalRows, completedRows }) {
    console.log(`Progress: ${completedRows} of ${totalRows} rows completed`);
}

async function showContent() {
    const tbody = document.getElementsByTagName('tbody')[0];

    const tables = await Promise.all(db.tables.map(async table => ({
        name: table.name,
        count: await table.count(),
        primKey: table.schema.primKey.src
    })));
    tbody.innerHTML = `
    <tr>
      <th>Test Datenbank</th>
      <td colspan="2">${db.name}</th>
    </tr>
    ${tables.map(({ name, count, primKey }) => `
      <tr>
        <th>Table: "${name}"</th>
        <td>Primary Key: ${primKey}</td>
        <td>Row count: ${count}</td>
      </tr>`)}
  `;
}