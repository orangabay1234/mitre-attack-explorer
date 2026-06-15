const openDB = require("./database");
const apiHandle = require("./server");

//Open database
const db = openDB();

//Start api server
apiHandle(db);
