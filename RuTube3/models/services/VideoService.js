'use strict'
const app = {};
const entities = require("../entities");

app.getVideos = function() {
    return new Promise(function (resolve, reject) {
        entities.Video.find(function(err, docs) {
            if (err) {
                reject(err);
            } else {
                var sendMsg = [];
                for (var i in docs) {
                    sendMsg.push({
                        _id: docs[i]._id,
                        title: docs[i].title,
                        owner: docs[i].owner
                    });
                }
                resolve(sendMsg);
            }
        });
    });
};

app.getVideosFromChannel = function(query) {
    return new Promise(function (resolve,reject) {
        entities.Video.find(query, function(err, docs) {
            if(err || docs.length === 0) {
                reject(err);
            } else {
                var sendMsg = [];
                for (var i in docs) {
                    sendMsg.push({
                        _id: docs[i]._id,
                        title: docs[i].title,
                        owner: docs[i].owner
                    });
                }
                resolve(sendMsg);
            }
        });
    });
};

app.addVideo = function (query, data){
    return new Promise(function (resolve, reject) {
        entities.User.find(query, function(err, docs) {
            if(err) {
                reject(err);
            } else {
                // Check if user exist
                if(docs[0] !== undefined && docs[0].username === data.owner) {
                    var entity = new entities.Video(data);
                    entity.save(function(err, doc) {
                        if(err) {
                            reject(err);
                        } else {
                            var sendMsg = {
                                _id: entity._id,
                                title: data.title,
                                owner: data.owner
                            };
                            resolve(sendMsg);
                        }
                    });
                } else {
                    reject("This channel does not exist");
                }
            }
        });	
    });
};

app.removeVideo = function(query) {
    return new Promise(function (resolve, reject) {
        entities.Video.remove(query, function(err, docs) {
            if(err) {
                reject(query);
                return;
            } else {
                resolve();
            }
        });
    });
};

module.exports = app;