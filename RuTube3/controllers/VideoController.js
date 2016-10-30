'use strict'
const express = require("express");
const app = express();
const entities = require("../models/entities");
const services = require("../models/services");
const uuid = require("node-uuid");
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extend: true
}));

// Get all videos
app.get("/videos", (req, res) => {
	services.VideoService.getVideos().then(function(data) {
        res.status(200).send(data);
    }).catch(function(reason) {
        res.status(500).send(reason);
    }); 
});

// Get all videos in a given channel
app.get("/videos/:username", (req, res) => {
	var query = {
		owner: req.params.username
	};
	services.VideoService.getVideosFromChannel(query).then(function(data) {
        res.status(200).send(data);
    }).catch(function(reason) {
        res.status(404).send(reason);
    }); 
});

// Post new video to a channel
app.post("/videos", (req, res) => {
	var query = {
		username: req.body.owner
	};
	var data = {
		title: req.body.title,
		owner: req.body.owner
	};
	services.VideoService.addVideo(query, data).then(function(data) {
        res.status(200).send(data);
    }).catch(function(reason) {
        res.status(404).send(reason);
    });
});

// Delete video by id
app.delete("/videos/:id", (req, res) => {
	var query = {
		_id: req.params.id
	};
	services.VideoService.removeVideo(query).then(function(data) {
        res.status(200).send(data);
    }).catch(function(reason) {
        res.status(404).send(reason);
    });
});

module.exports = app;