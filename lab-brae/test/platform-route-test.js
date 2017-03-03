'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Platform = require('../model/platform.js');
const Videogame = require('../model/videogame.js');

const PORT = process.env.PORT || 3000;

require('../server.js');

const url = `http://localhost:${PORT}`;

const examplePlatform = {
    name: 'test name',
    timestamp: new Date()
};

const exampleVideogame = {
    title: 'test title',
    genre: 'test genre'
};

describe('Platform Routes', function() {
    describe('POST: /api/platform', function() {
        describe('with a valid body', function() {
            after( done => {
                if (this.tempPlatform) {
                    Platform.remove({})
                    .then( () => done())
                    .catch(done);
                    return;
                };
                done();
            });

            it('should return a platform', done => {
                request.post(`${url}/api/platform`)
                .send(examplePlatform)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.status).to.equal(200);
                    expect(res.body.name).to.equal('test name');
                    this.tempPlatform = res.body;
                    done();
                });
            });
        });
    });

    describe('GET: /api/platform/:id', function() {
        describe('with a valid body', function() {
            before( done => {
                new Platform(examplePlatform).save()
                .then( platform => {
                    this.tempPlatform = platform;
                    return Platform.findByIdAndAddVideogame(platform._id, exampleVideogame);
                })
                .then( videogame => {
                    this.tempVideogame = videogame;
                    done();
                })
                .catch(done);
            });

            after( done => {
                if (this.tempPlatform) {
                    Platform.remove({})
                    .then( () => done())
                    .catch(done);
                    return;
                };
                done();
            });

            it('should return a platform', done => {
                request.get(`${url}/api/platform/${this.tempPlatform._id}`)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.status).to.equal(200);
                    expect(res.body.name).to.equal('test name');
                    expect(res.body.videogames.length).to.equal(1);
                    expect(res.body.videogames[0].title).to.equal(exampleVideogame.title);
                    done();
                });
            });
        });
    });

    describe('PUT: /api/platform/:id', function() {
        describe('with a valid body', function() {
            before( done => {
                new Platform(examplePlatform).save()
                .then( platform => {
                    this.tempPlatform = platform;
                    done();
                })
                .catch(done);
            });

            after( done => {
                if (this.tempPlatform) {
                    Platform.remove({})
                    .then( () => done())
                    .catch(done);
                    return;
                };
                done();
            });
            
            it('should return a platform', done => {
                var updated = { name: 'updated name' };

                request.put(`${url}/api/platform/${this.tempPlatform._id}`)
                .send(updated)
                .end((err, res) => {
                    if (err) return done(err);
                    let timestamp = new Date(res.body.timestamp);
                    expect(res.status).to.equal(200);
                    expect(res.body.name).to.equal(updated.name);
                    expect(timestamp.toString()).to.equal(examplePlatform.timestamp.toString());
                    done();
                });
            });

            it('should return a 400 status code', done => {
                let updatedPlatform = 'hmmmmm';
                request.put(`${url}/api/platform/${this.tempPlatform._id}`)
                .set('Content-Type', 'application/json')
                .send(updatedPlatform)
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    done();
                });
            });
        });
    });

    describe('DELETE: /api/platform/:id', function() {
        describe('with a valid body', function() {
            before( done => {
                new Platform(examplePlatform).save()
                .then( platform => {
                    this.tempPlatform = platform;
                    done();
                })
                .catch(done);
            });

            it('should delete a platform', done => {
                request.delete(`${url}/api/platform/${this.tempPlatform._id}`)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.status).to.equal(204);
                    expect(res.body).to.be.empty;
                    done();
                });
            });
        });
    });
});
