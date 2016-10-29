const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 4000;
const api = require("./controllers");
for(var i in api) {
    app.use(api[i]);
}
mongoose.connect("localhost/rutube");
mongoose.connection.once("open", () => {
    console.log("Connected to database")
    app.listen(port, function() {
        console.log("Web server started on port " + port);
    });    
});