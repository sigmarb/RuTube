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

/**
 * Get a list of all users
 * Returns 200 with list of all users, excluding paswords
 * Returns 500 if sometging went wrong
 */
app.get("/users", (req, res) => {
    services.AccountService.getUsers().then(function(data) {
        res.status(200).send(data);
    }).catch(function(reason) {
        res.status(500).send('Failed to get all users');
    });
});

/**
 * Create a new user
 * body must contain: name, username, password, email
 * Returns 201 with user_id of the new user if success
 * Returns 412 if something is missing
 */
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
        res.status(412).send('Failed to add new user');
    }); 
});

/**
 * Get user profile
 * params must contain {username}
 * Returns 200 with user profile if success
 * Returns 404 if something went wrong
 */
app.get("/users/:username", (req, res) => {
    var query = {
        username: req.params.username
    };
    services.AccountService.getUser(query).then(function(data) {
        res.status(200).send(data);
    }).catch(function(reason) {
        res.status(404).send('Failed to get a user by id');
    }); 
});

/**
 * Update your password
 * body must contain new password
 * headers must contain authorization containing _id of logged in user
 * Returns 203 if success
 * Returns 412 if somethind went wrong
 */
app.put("/my/profile/password", (req, res) => {
    var newPassword = req.body.password;
    var query = {
        _id: req.headers.authorization
    };
    services.AccountService.updatePassword(query, newPassword).then(function() {
        res.status(203).send('Password updated');
    }).catch(function(reason) {
        res.status(412).send('Failed to update password');
    }); 
});

/**
 * Update your username
 * body must contain new username
 * headers must contain authorization containing _id of logged in user
 * Returns 203 if success
 * Returns 412 if sometgind went wrong
 */
app.put("/my/profile/username", (req, res) => {
    var newUsername = req.body.username;
    var query = {
        _id: req.headers.authorization
    };
    services.AccountService.updateUsername(query, newUsername).then(function() {
        res.status(203).send('Username updated');
    }).catch(function(reason) {
        res.status(412).send('Failed to update username');
    }); 
});

/**
 * Delete user
 * params must contain {username}
 * Returns 200 if success
 * Returns 404 if sometgind went wrong
 */
app.delete("/users/:username", (req, res) => {
    var query = {
        username: req.params.username
    };
    services.AccountService.removeUser(query).then(function() {
        res.status(200).send('User removed');
    }).catch(function(reason) {
        res.status(404).send('Failed to delete a user by id');
    }); 
});

/**
 * Add a video to favorites
 * body must contain video_id
 * headers must contain authorization containing _id of logged in user
 * Returns 201 if success
 * Returns 412 if sometgind went wrong
 */
app.post("/my/profile/favorites", (req, res) => {
    var auth = req.headers.authorization;
    var videoId = req.body.video_id;
    var query = {
        video_id: videoId
    };
    services.UserService.addFavoriteVideo(auth, query).then(function() {
        res.status(201).send();
    }).catch(function(reason) {
        res.status(412).send('Failed to add video to favorite');
    }); 
});

/**
 * Get favorites for logged in user
 * headers must contain authorization containing _id of logged in user
 * Returns 200 if success
 * Returns 500 if sometgind went wrong
 */
app.get("/my/profile/favorites", (req, res) => {
    var auth = req.headers.authorization;
    var query = {
        user_id: auth
    }
    services.UserService.getFavoriteVideosByUserId(query).then(function(data) {
        res.status(200).send(data);
    }).catch(function(reason) {
        res.status(500).send('Failed to get favorite videos');
    });
});

/**
 * Get favorites for other user
 * params must contain {useranme} of other user
 * Returns 200 if success
 * Returns 500 if sometgind went wrong
 */
app.get("/users/:username/favorites", (req, res) => {
    var user = req.params.username;
    var query = {
        username: user
    };
    services.UserService.getFavoriteVideosByUsername(query).then(function(data) {
        res.status(200).send(data);
    }).catch(function(reason) {
        res.status(500).send('Failed to get favorite videos');
    });
});

/**
 * Delete a video from favorites
 * headers must contain authorization containing _id of logged in user
 * body must contain video_id
 * Returns 200 if success
 * Returns 404 if sometgind went wrong
 */
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
        res.status(404).send('Failed to delete video from favorite');
    });
});

/**
 * Add a close friend
 * headers must contain authorization containing _id of logged in user
 * body must contain username of friend
 * Returns 201 if success
 * Returns 412 if sometgind went wrong
 */
app.post("/my/profile/friends", (req, res) => {
    var auth = req.headers.authorization;
    var username = req.body.username;
    var query = {
        username: username
    };
    services.UserService.addFriend(query, auth).then(function() {
        res.status(201).send('Close friend added');
    }).catch(function(reason) {
        res.status(412).send('Failed to add new close friend');
    });
});

/**
 * Get close friends of user logged in
 * headers must contain authorization containing _id of logged in user
 * Returns 200 if success
 * Returns 500 if sometgind went wrong
 */
app.get("/my/profile/friends", (req, res) => {
    var auth = req.headers.authorization;
    var query = {
        user_id: auth
    }
    services.UserService.getFriendsById(query).then(function(data) {
        res.status(200).send(data);
    }).catch(function(reason) {
        res.status(500).send('Failed to get close friends');
    });
});

/**
 * Get friends of other user
 * params must contain {username} of other user
 * returns 200 if success
 * Returns 500 if something went wrong
 */
app.get("/users/:username/friends", (req, res) => {
    var user = req.params.username;
    var query = {
        username: user
    };
    services.UserService.getFriendsByUsername(query).then(function(data) {
        res.status(200).send(data);
    }).catch(function(reason) {
        res.status(500).send('Failed to get close friends');
    });
});

/**
 * Remove a friend from close friends
 * body must contain username of other user
 * headers must contain authorization containing _id of logged in user
 * Returns 200 if success
 * Returns 404 if sometgind went wrong
 */
app.delete("/my/profile/friends", (req, res) => {
    var auth = req.headers.authorization;
    var username = req.body.username;
    var query = {
        username: username
    };
    services.UserService.deleteFriends(query, auth).then(function(data) {
        res.status(200).send('Close friend removed');
    }).catch(function(reason) {
        res.status(404).send('Failed to delete close friend');
    });
});

/**
 * Authenticate login
 * body must contain username and password
 * Returns 200 if login successful
 * Returns 404 if Failed
 */
app.post("/login", (req, res) => {
    var query = {
        username: req.body.username,
        password: req.body.password
    };
    services.AccountService.authenticate(query).then(function(data) {
        res.status(200).send(data);
    }).catch(function(reason) {
        res.status(404).send('Failed to login');
    });
});

module.exports = app;