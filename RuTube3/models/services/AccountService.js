'use strict'
const app = {};
const entities = require("../entities");

app.addUser = function (data) {
    return new Promise(function (resolve, reject) {
        var entity = new entities.User(data);
        entity.save(function(err, doc) {
            if (err) {
                reject(err);
            } else {
                var sendMsg = {
                    _id: entity._id,
                    name: data.usernme
                };
                resolve(sendMsg);
            }
        });
    });
};

app.getUsers = function () {
    return new Promise(function (resolve, reject) {
        entities.User.find(function(err, docs) {
            if (err) {
                reject(err);
            } else {
                var sendMsg = [];
                for (var i in docs) {
                    sendMsg.push({
                        _id: docs[i]._id,
                        name: docs[i].name,
                        username: docs[i].username,
                        email: docs[i].email
                    });
                }
                resolve(sendMsg);
            }
        });
    });
};

app.getUser = function (query) {
    return new Promise(function (resolve, reject) {
        entities.User.find(query, function(err, docs) {
            if(err || docs.length === 0) {
                reject(err);
            } else {
                var sendMsg = {
                    username: docs[0].username,
                    email: docs[0].email,
                    name: docs[0].name
                }
                resolve(sendMsg);
            }
        });
    });
};

app.updatePassword = function(query, newPassword) {
    return new Promise(function (resolve, reject) {
        entities.User.find(query, function(err, docs) {
            if(err) {
                reject(err);
            } else {
                docs[0].password = newPassword;
                docs[0].save(function(err) {
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

app.updateUsername = function(query, newUsername) {
    return new Promise(function (resolve, reject) {
        entities.User.find(query, function(err, docs) {
            if(err) {
                reject(err);
            } else {
                docs[0].username = newUsername;
                docs[0].save(function(err) {
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

app.removeUser = function(query) {
    return new Promise(function (resolve, reject) {
        entities.User.remove(query, function(err, docs) {
            if(err) {
                reject(err);
                return;
            } else {
                resolve();
            }
        });
    });
};

app.authenticate = function(query) {
    return new Promise(function (resolve, reject) {
        entities.User.find(query, function(err, docs) {
            if (err || docs.length === 0) {
                reject(err);
            } else {
                resolve({_id: docs[0]._id});
            }
        });
    });
};

module.exports = app;