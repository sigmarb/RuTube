'use strict';

const request = require('supertest');
const should = require('should');
const express = require('express');
const entities = require("../models/entities");
const mongoose = require('mongoose');
const app = express();
const api = require("../controllers");
var user;
var user2;
var video;
for(var i in api) {
    app.use(api[i]);
}
describe('UserService', function(){
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
        user = new entities.User(u);
        user.save(function(err) { });
        var v = {
            title: 'Im painting my wall blue',
            owner: 'asgeir'
        };
        video = new entities.Video(v);
        video.save(function(err) { });

        var u2 = {
            username: 'quang',
            name: 'quang',
            password: 'quanghot69',
            email: 'is_a@mail.com'
        };
        user2 = new entities.User(u2);
        user2.save(function(err) { });
        var v2 = {
            title: 'Im cleaning my room',
            owner: 'quang'
        };
        var video2 = new entities.Video(v2);
        video2.save(function(err) { });
        var f = {
            user_id: user._id,
            friend_id: user2._id
        };
        var friend = new entities.CloseFriend(f);
        friend.save(function(err) { });
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

    it('View the profile of a user and confirm it correctly matches the expected profile', function(done){
        request(app)
        .get('/users/quang')
        .expect(200)
        .end(function(err,res) {
            if(err) {
                throw err;
            }
            res.body.name.should.equal('quang');
            res.body.username.should.equal('quang');
            res.body.email.should.equal('is_a@mail.com')
            done();
        });
    });

    it('Add favorite videos to a user, read the profile back and confirm the list matches', function(done){
        var a = {
            video_id: video._id
        };
        var headers = {
            Authorization: user._id
        };
        request(app)
        .post('/my/profile/favorites')
        .set(headers)
        .send(a)
        .expect(201)
        .end(function(err,res) {
            if(err) {
                throw err;
            }
            request(app)
            .get('/users/asgeir/favorites')
            .expect(200)
            .end(function(err,res) {
                if(err) {
                    throw err;
                }
                res.body.should.have.length(1);
                var string1 = JSON.stringify(res.body[0].video_id);
                string1.should.equal(JSON.stringify(a.video_id));
                done();
            });
        });
    });

    it('Update the username of a user, read the profile and confirm it changed', function(done){
        var a = {
            username: 'newUsername'
        };
        var headers = {
            Authorization: user._id
        };
        request(app)
        .put('/my/profile/username')
        .set(headers)
        .send(a)
        .expect(203)
        .end(function(err,res) {
            if(err) {
                throw err;
            }
            request(app)
            .get('/users/newUsername')
            .set(headers)
            .expect(200)
            .end(function(err, res) {
                res.body.username.should.equal('newUsername');
                done();
            });
        });
    });

    it('Add a list of close friends to a profile and read it back to confirm it was stored properly', function(done){
        var a = {
            username: 'quang'
        };
        var headers = {
            Authorization: user._id
        };
        request(app)
        .post('/my/profile/friends')
        .set(headers)
        .send(a)
        .expect(201)
        .end(function(err,res) {
            if(err) {
                throw err;
            }
            request(app)
            .get('/users/asgeir/friends')
            .expect(200)
            .end(function(err, res) {
                var friendId = JSON.stringify(res.body[0].friend_id);
                friendId.should.equal(JSON.stringify(user2._id));
                done();
            });
        });
    });
});