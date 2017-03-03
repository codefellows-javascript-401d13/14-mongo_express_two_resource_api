'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const People = require('../model/people.js');
const President = require('../model/president.js');

const PORT = process.env.PORT || 3000;
const debug = require('debug')('people:president-route-test');

process.env.MONGODB_URI = 'mongodb://localhost/peopletest';

require('../server.js');

const url = `http://localhost:${PORT}`;

const examplePeople = {
  name: 'test name',
  timestamp: new Date()
};

const examplePresident = {
  name: 'test name',
  age: 'test age'
};

describe('Presidents routes', function() {
  describe('POST: /api/people/:peopleID/president', function() {
    describe('with a valid people id body', function() {
      before(done => {
        new People(examplePeople).save()
        .then( people => {
          this.tempPeople = people;
          done();
        })
        .catch(done);
      });

      after( done => {
        Promise.all([
          People.remove({}),
          President.remove({})
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return a valid president', done => {
        request.post(`${url}/api/people/${this.tempPeople.id}/president`)
        .send(examplePresident)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(examplePresident.name);

          debug('id', res.body.peopleID);
          debug('tempid', this.tempPeople._id.toString());
          expect(res.body.peopleID).to.equal(this.tempPeople._id.toString());

          done();
        });
      });
    });
  });
});
