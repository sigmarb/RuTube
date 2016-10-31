'use strict';

const request = require('supertest');
const should = require('should');
const express = require('express');
const entities = require("../models/entities");
const mongoose = require('mongoose');
const app = express();
const api = require("../controllers");
for(var i in api) {
    app.use(api[i]);
}
describe('VideoService', function(){
    beforeEach(function(done) {
        mongoose.connect("localhost/mock_db");
        mongoose.connection.once("open", () => {
        });
        var u = {
            username: 'asgeir',
            name: 'asgeir',
            password: 'asgeirhot69',
            email: 'not_a@mail.com'
        };
        var user = new entities.User(u);
        user.save(function(err) { });
        var v = {
            title: 'Im painting my wall blue',
            owner: 'asgeir'
        };
        var video = new entities.Video(v);
        video.save(function(err) { });

        var u2 = {
            username: 'quang',
            name: 'quang',
            password: 'quanghot69',
            email: 'is_a@mail.com'
        };
        var user2 = new entities.User(u2);
        user2.save(function(err) { });
        var v2 = {
            title: 'Im cleaning my room',
            owner: 'quang'
        };
        var video2 = new entities.Video(v2);
        video2.save(function(err) { });

        done();
    });
    afterEach(function(done) {
        for (var i in entities) {
            entities[i].remove(function (drop){
            });
        }
        mongoose.connection.close();
        done();
    });

    it('Add a video to a channel and confirm it’s listed in “all videos”', function(done){
        var v = {
            title: 'Im painting my wall green now',
            owner: 'asgeir'
        };
        request(app)
        .post('/videos')
        .send(v)
        .expect(201)
        .end(function(err,res) {
            if(err) {
                throw err;
            }
            res.body.should.have.property('_id');
            res.body.title.should.equal('Im painting my wall green now');
            res.body.owner.should.equal('asgeir');
            request(app)
            .get('/videos')
            .expect(200)
            .end(function(err,res) {
                if(err) {
                    throw err;
                }
                res.body.should.have.length(3);
                res.body[2].title.should.equal('Im painting my wall green now');
                res.body[2].owner.should.equal('asgeir');
                done();
            });
        });
    });

    it('Add a video to a channel and confirm it’s listed in that channel', function(done) {
        var v = {
            title: 'Im cleaning my brothers room now',
            owner: 'quang'
        };
        request(app)
        .post('/videos')
        .send(v)
        .expect(201)
        .end(function(err,res) {
            if(err) {
                throw err;
            }
            res.body.should.have.property('_id');
            res.body.title.should.equal('Im cleaning my brothers room now');
            res.body.owner.should.equal('quang');
            request(app)
            .get('/videos/quang')
            .expect(200)
            .end(function(err,res) {
                if(err) {
                    throw err;
                }
                res.body.should.have.length(2);
                res.body[1].title.should.equal('Im cleaning my brothers room now');
                res.body[1].owner.should.equal('quang');
                done();
            })
        });
    });

    it('Remove a video and confirm it’s not listed in all videos or the (previous) channel list', function(done) {
        var v = {
            title: 'Please remove me',
            owner: 'quang'
        };
        // Add video
        request(app)
        .post('/videos')
        .send(v)
        .expect(201)
        .end(function(err,res) {
            if(err) {
                throw err;
            }
            // Make sure that the video is in all videos from given channel list
            request(app)
            .get('/videos/quang')
            .expect(200)
            .end(function(err,res) {
                if(err) {
                    throw err;
                }
                res.body.should.have.length(2);
                res.body[1].title.should.equal('Please remove me');
                // Make sure that the video is in all videos list
                request(app)
                .get('/videos')
                .expect(200)
                .end(function(err,res) {
                    if(err) {
                        throw err;
                    }
                    res.body.should.have.length(3);
                    res.body[2].title.should.equal('Please remove me');
                    // Remove the video
                    var videoId = res.body[2]._id;
                    var removeURL = '/videos/' + videoId;
                    request(app)
                    .delete(removeURL)
                    .expect(200)
                    .end(function(err,res) {
                        if(err) {
                            throw err;
                        }
                        // Make sure that the video is no longer in all videos from given channel list
                        request(app)
                        .get('/videos/quang')
                        .expect(200)
                        .end(function(err,res) {
                            if(err) {
                                throw err;
                            }
                            res.body.should.have.length(1);
                            // Make sure that the video is no longer in all videos list
                            request(app)
                            .get('/videos')
                            .expect(200)
                            .end(function(err,res) {
                                if(err) {
                                    throw err;
                                }
                                res.body.should.have.length(2);
                                done();
                            })
                        })
                    })
                });
            });
        });
    });
});