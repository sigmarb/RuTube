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

/**
 * Get all videos
 * Returns 200 if ok
 * Returns 500 if not ok
 */
app.get("/videos", (req, res) => {
	services.VideoService.getVideos().then(function(data) {
        res.status(200).send(data);
    }).catch(function(reason) {
        res.status(500).send('Failed to get all videos');
    }); 
});

/**
 * Get all videos from chanel
 * params must contain {username}
 * Returns 200 if ok
 * Returns 404 if not ok
 */
app.get("/videos/:username", (req, res) => {
	var query = {
		owner: req.params.username
	};
	services.VideoService.getVideosFromChannel(query).then(function(data) {
        res.status(200).send(data);
    }).catch(function(reason) {
        res.status(404).send('Failed to get all videos in a given channel');
    }); 
});

/**
 * Post a video
 * Body must contain owner and title of the video
 * Returns 201 if ok
 * Returns 412 if not ok
 */
app.post("/videos", (req, res) => {
	var query = {
		username: req.body.owner
	};
	var data = {
		title: req.body.title,
		owner: req.body.owner
	};
	services.VideoService.addVideo(query, data).then(function(data) {
        res.status(201).send(data);
    }).catch(function(reason) {
        res.status(412).send('Failed to add new video to channel');
    });
});

/**
 * Remove a video
 * params must contain {_id} of video
 * Returns 200 if ok
 * Returns 404 if not ok
 */
app.delete("/videos/:id", (req, res) => {
	var query = {
		_id: req.params.id
	};
	services.VideoService.removeVideo(query).then(function(data) {
        res.status(200).send(data);
    }).catch(function(reason) {
        res.status(404).send('Failed to delete video by id');
    });
});

module.exports = app;