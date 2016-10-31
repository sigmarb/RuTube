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
describe('AccountService', function(){
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

    it('Create user and confirm successful authentication', function(done){
        var u = {
            username: 'sigmkar',
            name: 'slimberino',
            password: 'simmihot69',
            email: 'she@mail.com'
        };
        request(app)
        .post('/users')
        .send(u)
        .expect(201)
        .end(function(err,res){
            if(err){
                throw err;
            }
            res.body.should.have.property('_id');
            var loginData = {
                username: 'sigmkar',
                password: 'simmihot69'
            };
            request(app)
            .post('/login')
            .send(loginData)
            .expect(200)
            .end(function(err,res) {
                if(err){
                    throw err;
                }
                res.body.should.have.property('_id');
                done();
            });
        });
    });

    it('Try to create a user that already exists', function(done) {
        var u = {
            username: 'asgeir',
            name: 'asgeir',
            password: 'asgeirhot69',
            email: 'not_a@mail.com'
        };
        request(app)
        .post('/users')
        .send(u)
        .expect(412)
        .end(function(err, res) {
            if(err) {
                throw err;
            }
            done();
        });
    });

    it('Try to authenticate a user with a wrong password', function(done) {
        var loginData = {
            username: 'asgeir',
            password: 'bad'
        };
        request(app)
        .post('/login')
        .send(loginData)
        .expect(404)
        .end(function(err, res) {
            if(err) {
                throw err;
            }
            done();
        });
    });
});