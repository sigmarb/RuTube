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

// Get all videos
app.get("/videos", (req, res) => {
	entities.video.find(function(err, docs) {
        if (err) {
            res.status(500).send("Something went wrong: " + err);
            return;
        } else {
            var sendMsg = [];
            for (var i in docs) {
                sendMsg.push({
                    _id: docs[i]._id,
                    title: docs[i].title,
                    owner: docs[i].owner
                });
            }
            res.status(200).send(sendMsg);
        }
    });
});

// Get all videos in a given channel
app.get("/videos/:username", (req, res) => {
	var query = {
		owner: req.params.username
	};
	entities.video.find(query, function(err, docs) {
		if(err) {
			res.status(500).send("Something went wrong: " + err);
			return;
		} else {
			var sendMsg = [];
			for (var i in docs) {
				sendMsg.push({
					_id: docs[i]._id,
                    title: docs[i].title,
                    owner: docs[i].owner
				});
			}
			res.status(200).send(sendMsg);
		}
	});
});

// Post new video to a channel
app.post("/videos", (req, res) => {
	var query = {
		username: req.body.owner
	}
	entities.user.find(query, function(err, docs) {
		if(err) {
			res.status(500).send("Something went wrong: " + err);
			return;
		} else {
			// Check if user exist
			if(docs[0] !== undefined && docs[0].username === req.body.owner) {
				var data = {
					title: req.body.title,
					owner: req.body.owner
				}
				var entity = new entities.video(data);
				entity.save(function(err, doc) {
					if(err) {
						res.status(412).send("Something went wrong: " + err);
					} else {
						res.status(201).send({
							_id: entity._id,
							title: data.title,
							owner: data.owner
						})
					}
				});
			} else {
				res.status(412).send("This channel does not exist");
				return;
			}
		}
	});	
});

// Delete video by id
app.delete("/videos/:id", (req, res) => {
	entities.video.remove({
		_id: req.params.id
	}, function(err, docs) {
		if(err) {
			res.status(404).send("Something went wrong: " + err);
			return;
		} else {
			res.send("Video with id " + req.params.id + " has been removed");
		}
	});
});

module.exports = app;