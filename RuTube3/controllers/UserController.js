'use strict'
const express = require("express");
const app = express();
const entities = require("../models/entities");
const uuid = require("node-uuid");
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extend: true
}));
const adminToken = "Swagger";

/* ---------------------------- Dót fyrir Account Service ----------------------------*/

// Get all users
app.get("/users", (req, res) => {
    entities.user.find(function(err, docs) {
        if (err) {
            res.status(500).send("Something went wrong: " + err);
            return;
        } else {
            var sendMsg = [];
            for (var i in docs) {
                sendMsg.push({
                    _id: docs[i]._id,
                    name: docs[i].name,
                    username: docs[i].username
                });
            }
            res.status(200).send(sendMsg);
        }
    });
});

// Post new user
app.post("/users", (req, res) => {
    var data = {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    };
    var entity = new entities.user(data);
    entity.save(function(err, doc) {
        if (err) {
            res.status(412).send("Something went wrong: " + err);
            return;
        } else {
            res.status(201).send({
                _id: entity._id,
                name: data.usernme
            });
        }
    });
});

// Get user by id
app.get("/users/:id", (req, res) => {
    var query = {
        _id: req.params.id
    };
    entities.user.find(query, function(err, docs) {
        if(err) {
            res.status(404).send("Something went wrong: " + err);
            return;
        } else {
            res.status(200).send(docs);
        }
    });
});

// Update user password
app.put("/users/:id", (req, res) => {
    var newPassword = req.body.password;
    var query = {
        _id: req.params.id
    };
    entities.user.find(query, function(err, docs) {
        if(err) {
            res.status(404).send("Something went wrong: " + err);
            return;
        } else {
            docs[0].password = newPassword;
            docs[0].save(function(err) {
                if(err) {
                    res.status(412).send("Something went wrong "+ err);
                } else {
                    res.send(docs[0].name + "'s password has been changed");
                }
            });
        }
    });
});

// Delete user by id
app.delete("/users/:id", (req, res) => {
    entities.user.remove({
        _id: req.params.id
    }, function(err, docs) {
        if(err) {
            res.status(404).send("Something went wrong " + err);
            return;
        } else {
            res.send("User with id " + req.params.id + " has been removed");
        }
    });
});

/* ---------------------------- Dót fyrir User Service ----------------------------*/


module.exports = app;