'use strict'
const express = require("express");
const app = express();
const entities = require("../models/entities");
const uuid = require("node-uuid");
const bodyParser = require('body-parser');
const services = require("../models/services");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extend: true
}));

// Get all users
app.get("/users", (req, res) => {
    services.AccountService.getUsers().then(function(data) {
        res.status(200).send(data);
    }).catch(function(reason) {
        res.status(500).send(reason);
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
    services.AccountService.addUser(data).then(function(data) {
        res.status(201).send(data);
    }).catch(function(reason) {
        res.status(412).send(reason);
    }); 
});

// Get user by id
app.get("/users/:username", (req, res) => {
    var query = {
        username: req.params.username
    };
    services.AccountService.getUser(query).then(function(data) {
        res.status(200).send(data);
    }).catch(function(reason) {
        res.status(404).send(reason);
    }); 
});

// Update user password
app.put("/my/profile/password", (req, res) => {
    var newPassword = req.body.password;
    var query = {
        _id: req.headers.authorization
    };
    services.AccountService.updatePassword(query, newPassword).then(function() {
        res.status(203).send('Password updated');
    }).catch(function(reason) {
        res.status(412).send(reason);
    }); 
});

// Delete user by id
app.delete("/users/:username", (req, res) => {
    var query = {
        username: req.params.username
    };
    services.AccountService.removeUser(query).then(function() {
        res.status(200).send('User removed');
    }).catch(function(reason) {
        res.status(404).send(reason);
    }); 
});

// Add a favorite video to service
app.post("/my/profile/favorites", (req, res) => {
    var auth = req.headers.authorization;
    var videoId = req.body.video_id;
    var query = {
        video_id: videoId
    };
    services.UserService.addFavoriteVideo(auth, query).then(function() {
        res.status(200).send();
    }).catch(function(reason) {
        res.status(500).send(reason);
    }); 
});

app.get("/my/profile/favorites", (req, res) => {
    var auth = req.headers.authorization;
    var query = {
        user_id: auth
    }
    services.UserService.getFavoriteVideosByUserId(query).then(function(data) {
        res.status(200).send(data);
    }).catch(function(reason) {
        res.status(500).send(reason);
    });
});

app.get("/users/:username/favorites", (req, res) => {
    var user = req.params.username;
    var query = {
        username: user
    };
    services.UserService.getFavoriteVideosByUsername(query).then(function(data) {
        res.status(200).send(data);
    }).catch(function(reason) {
        res.status(500).send(reason);
    });
});

app.delete("/my/profile/favorites", (req, res) => {
    var auth = req.headers.authorization;
    var videoId = req.body.video_id;
    var query = {
        user_id: auth,
        video_id: videoId
    };
    services.UserService.deleteFavoriteVideo(query).then(function(data) {
        res.status(200).send(data);
    }).catch(function(reason) {
        res.status(500).send(reason);
    });
});

app.post("/my/profile/friends", (req, res) => {
    var auth = req.headers.authorization;
    var username = req.body.username;
    var query = {
        username: username
    };
    services.UserService.addFriend(query, auth).then(function() {
        res.status(200).send('Friend added');
    }).catch(function(reason) {
        res.status(500).send(reason);
    });
});

app.get("/my/profile/friends", (req, res) => {
    var auth = req.headers.authorization;
    var query = {
        user_id: auth
    }
    services.UserService.getFriendsById(query).then(function(data) {
        res.status(200).send(data);
    }).catch(function(reason) {
        res.status(500).send(reason);
    });
});

app.get("/users/:username/friends", (req, res) => {
    var user = req.params.username;
    var query = {
        username: user
    };
    services.UserService.getFriendsByUsername(query).then(function(data) {
        res.status(200).send(data);
    }).catch(function(reason) {
        res.status(500).send(reason);
    });
});

app.delete("/my/profile/friends", (req, res) => {
    var auth = req.headers.authorization;
    var username = req.body.username;
    var query = {
        username: username
    };
     services.UserService.deleteFriends(query, auth).then(function(data) {
        res.status(200).send('Friend removed');
    }).catch(function(reason) {
        res.status(500).send(reason);
    });
});

module.exports = app;