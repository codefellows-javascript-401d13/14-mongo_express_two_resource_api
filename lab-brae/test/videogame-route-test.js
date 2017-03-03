'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Platform = require('../model/platform.js');
const Videogame = require('../model/videogame.js');

const PORT = process.env.PORT || 3000;

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleVideogame = {
    title: 'test title',
    genre: 'test genre'
};

const examplePlatform = {
    name: 'test name',
    timestamp: new Date()
};

describe('Videogame Routes', function() {
    describe('POST: /api/platform/:platformID/videogame', function() {
        describe('with a valid platform id and videogame body', () => {
            before( done => {
                new Platform(examplePlatform).save()
                .then( platform => {
                    this.tempPlatform = platform;
                    done();
                })
                .catch(done);
            });

            after( done => {
                Promise.all([
                    Platform.remove({}),
                    Videogame.remove({})
                ])
                .then(() => done())
                .catch(done);
            });

            it('should return a videogame', done => {
                request.post(`${url}/api/platform/${this.tempPlatform.id}/videogame`)
                .send(exampleVideogame)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.title).to.equal(exampleVideogame.title);
                    expect(res.body.genre).to.equal(exampleVideogame.genre);
                    expect(res.body.platformID).to.equal(this.tempPlatform._id.toString());
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
                    Promise.all([
                        Videogame.remove({}),
                        Platform.remove({}),
                    ])
                    .then( () => done())
                    .catch(done);
                    return;
                }
                done();
            });

            it('should delete a videogame', done => {
                request.delete(`${url}/api/platform/${this.tempVideogame._id}`)
                .end((err, res) => {
                    if (err) done(err);
                    expect(res.status).to.equal(204);
                    expect(res.body).to.be.empty;
                    done();
                });
            });
        });

        describe('with a valid path but invalid id', function() {
            it('should return a 404 status code', done => {
                request.delete(`${url}/api/platform/123456789`)
                .end((err, res) => {
                    expect(res.status).to.equal(404);
                    done();
                });
            });
        });
    });
});