'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const People = require('../model/people.js');
const President = require('../model/president.js');

const PORT = process.env.PORT || 3000;
const debug = require('debug')('people:people-route-test');

process.env.MONGODB_URI = 'mongodb://localhost/peopletest';

require('../server.js');

const url = `http://localhost:${PORT}`;

const examplePeople = {
  name: 'test people name',
  timestamp: new Date()
};

const examplePresident = {
  name: 'test name',
  age: 'test age'
};

describe('People routes', function() {
  describe('POST: /api/people', function() {
    describe('with a valid body', function() {
      after( done => {
        if(this.tempPeople) {
          People.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a valid people', done => {
        request.post(`${url}/api/people`)
        .send(examplePeople)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          this.tempPeople = res.body;
          expect(res.body.name).to.equal('test people name');
          done();
        });
      });
    });

    describe('with no body supplied', function() {
      it('should return a 400 error', function() {
        request.post(`${url}/api/people`)
        .send()
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });

  describe('GET: /api/people/:id', function() {
    describe('with a valid body', function() {
      before( done => {
        new People(examplePeople).save()
        .then( people => {
          this.tempPeople = people;
          return People.findByIdAndAddPresident(people._id, examplePresident)
        })
        .then( president => {
          this.tempPresident = president;
          done();
        })
        .catch(done);
      });

      after( done => {
        if(this.tempPeople) {
          People.remove({})
          .then(() => done())
          .catch(done);
          return;
        };
        done();
      });

      it('should return an actual people', done => {
        request.get(`${url}/api/people/${this.tempPeople._id}`)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test people name');
          expect(res.body.presidents.length).to.equal(1);
          done();
        });
      });
    });

    describe('with an invalid id', function() {
      it('should return a 404 error', function() {
        request.get(`${url}/api/people/121212`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('PUT: api/people/:id', function() {
    describe('with a valid id and body', function() {
      before( done => {
        new People(examplePeople).save()
        .then( people => {
          this.tempPeople = people;
          done();
        })
        .catch(done);
      });

      after( done => {
        if(this.tempPeople) {
          People.remove({})
          .then(() => done())
          .catch(done);
          return;
        };
        done();
      });

      it('should update a people with a valid id and body', done => {
        let updatePeople = {name: 'some new people'}
        request.put(`${url}/api/people/${this.tempPeople._id}`)
        .send(updatePeople)
        .end((err, res) => {
          if(err) return done(err);
          let timestamp = new Date(res.body.timestamp);
          expect(res.status).to.equal(200);
          expect(timestamp.toString()).to.equal(examplePeople.timestamp.toString());
          expect(res.body.name).to.equal(updatePeople.name);
          done();
        });
      });
    });

    describe('with an invalid id', function() {
      it('should return a 404 error with an invalid id', function() {
        request.put(`${url}/api/people/28288282`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('with no body supplied', function() {
      it('should return a 400 error', function() {
        request.put(`${url}/api/people`)
        .send()
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });
  describe('DELETE: api/people/:id', function() {
    describe('with a valid id', function() {
      before( done => {
        new People(examplePeople).save()
        .then( people => {
          this.tempPeople = people;
          return People.findByIdAndAddPresident(people._id, examplePresident)
        })
        .then( president => {
          this.tempPresident = president;
          done();
        })
        .catch(done);
      });

      after( done => {
        if(this.tempPeople) {
          People.remove({})
          .then(() => done())
          .catch(done);
          return;
        };
        done();
      });

      it('should return a 204 status', done => {
        request.delete(`${url}/api/people/${this.tempPeople._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(204);
          done();
        });
      });
    });
  });
});
