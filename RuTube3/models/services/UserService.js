'use strict'
const app = {};
const entities = require("../entities");


app.addFavoriteVideo = function (auth, query) {
    return new Promise(function (resolve, reject) {
        entities.Video.find(query, function(err) {
            if (err) {
                reject(err);
            } else {
                var data = {
                    user_id: auth,
                    video_id: query.video_id
                };
                var entity = new entities.FavoriteVideo(data);
                entity.save(function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }
        });
    });
};

app.getFavoriteVideosByUserId = function (query) {
    return new Promise(function (resolve, reject) {
        entities.FavoriteVideo.find(query, function (err, docs) {
            if (err) {
                reject(err);
            } else {
                var sendMsg = [];
                for (var i in docs) {
                    sendMsg.push({
                        video_id: docs[i].video_id
                    });
                }
                resolve(sendMsg);
            }
        });
    });
};

app.getFavoriteVideosByUsername = function (query) {
    return new Promise(function(resolve, reject) {
        entities.User.find(query, function (err, docs) {
            if (err) {
                reject("User not found");
            } else {
                query = {
                    user_id: docs[0]._id
                };
                entities.FavoriteVideo.find(query, function(err, docs) {
                    if (err) {
                        reject("No favorite videos");
                    } else {
                        var sendMsg = [];
                        for (var i in docs) {
                            sendMsg.push({
                                video_id: docs[i].video_id
                            });
                        }
                        resolve(sendMsg);
                    }
                });
            }
        });
    });
};

app.deleteFavoriteVideo = function (query) {
    return new Promise(function(resolve, reject) {
        entities.FavoriteVideo.remove(query, function(err, docs) {
            if(err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

app.addFriend = function (query, auth) {
    return new Promise(function(resolve, reject) {
        entities.User.find(query, function(err, doc) {
            if (err) {
                reject(err);
            } else {
                var data = {
                    user_id: auth,
                    friend_id: doc[0]._id
                };
                var entity = new entities.CloseFriend(data);
                entity.save(function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }
        })
    });
};

app.getFriendsById = function (query) {
    return new Promise(function(resolve, reject) {
        entities.CloseFriend.find(query, function (err, docs) {
            if (err) {
                reject(err);
            } else {
                var sendMsg = [];
                for (var i in docs) {
                    sendMsg.push({
                        friend_id: docs[i].friend_id
                    });
                }
                resolve(sendMsg);
            }
        });
    });
};


app.getFriendsByUsername = function (query) {
    return new Promise(function(resolve, reject) {
        entities.User.find(query, function (err, docs) {
            if (err) {
                reject(err);
            } else {
                query = {
                    user_id: docs[0]._id
                };
                entities.CloseFriend.find(query, function(err, docs) {
                    if (err || docs.length === 0) {
                        resolve("No favorite videos");
                    } else {
                        var sendMsg = [];
                        for (var i in docs) {
                            sendMsg.push({
                                friend_id: docs[i].friend_id
                            });
                        }
                        resolve(sendMsg);
                    }
                });
            }
        });
    });
};

app.deleteFriend = function (query, auth) {
    return new Promise(function(resolve, reject) {
        entities.User.find(query, function(err, docs) {
            if (err) {
                reject(err);
            } else {
                query = {
                    user_id: auth,
                    friend_id: docs[0]._id
                }
                entities.CloseFriend.remove(query, function(err, docs) {
                    if(err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }
        });
    });
};
    

module.exports = app;