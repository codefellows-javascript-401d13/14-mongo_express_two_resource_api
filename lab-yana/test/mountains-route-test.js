'use strict';

const request = require('superagent');
const expect = require('chai').expect;
const Mountains = require('../model/mountains.js');
const Peak = require('../model/peak.js');
const url = 'http://localhost:3003';

require('../server.js');

const testPeak = {
  name: 'test peak name',
  content: 'test peak content'
}

const testMountains = {
  name: 'test Mountains name',
  timestamp: new Date()
}

describe('Mountains Routes', function() {
  describe('POST: /api/mountains', function() {
    describe('with a valid body', function() {
      after(done => {
        if (this.tempMountains) {
          Mountains.remove({})
          .then( () => done())
          .catch(done);
        }
        // done(); //in case we don't go in the if block;
      });
      it('should return a list', done => {
        request.post(`${url}/api/mountains`)
        .send(testPeak)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(testPeak.name);
          this.tempMountains = res.body;
          done();
        });
      });
    });
    describe('without a valid body', function() {
      it('should return a 400 bad request error', done => {
        request.post(`${url}/api/mountains`)
        .end(err => {
          expect(err.status).to.equal(400);
          done();
        });
      });
    });
  });
  describe('GET: /api/mountains/:id', function() {
    before(done => {
      new Mountains(testMountains).save()
      .then(mountains => {
        this.tempMountains = mountains;
        return Mountains.findByIdAndAddPeak(mountains._id, testPeak);
      })
      .then(peak => {
        this.tempPeak = peak;
        done();
      })
      .catch(done);
    });
    after(done => {
      if (this.tempMountains) {
        Mountains.remove({})
        .catch(done)
        .then( () => done());
      }
      // done();
    });
    describe('with a valid id', () => {
      it('should return list of peaks', done => {
        request.get(`${url}/api/mountains/${this.tempMountains._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(testMountains.name);
          expect(res.body.peaks.length).to.equal(1);
          expect(res.body.peaks[0].name).to.equal(testPeak.name);
          done();
        });
      });
    });
    describe('with an invalid id', () => {
      it('should return a 404 not found', done => {
        request.get(`${url}/api/mountains/somewrongid`)
        .end(err => {
          expect(err.status).to.equal(404);
          done();
        });
      });
    });
  });
  describe('PUT: /api/mountains/:id', function() {
    beforeEach(done => {
      new Mountains(testMountains).save()
      .catch(done)
      .then(mountains => {
        this.tempMountains = mountains;
        return Mountains.findByIdAndAddPeak(mountains._id, testPeak);
      })
      .then(peak => {
        this.tempPeak = peak;
        done();
      });
    });
    afterEach(done => {
      if (this.tempMountains) {
        Mountains.remove({})
        .then( () => done())
        .catch(done);
      }
      // done();
    });
    describe('with a valid id and body', () => {
      it('should return an updated list', done => {
        let update = { name: 'updated peak name' }
        request.put(`${url}/api/mountains/${this.tempMountains._id}`)
        .send(update)
        .end((err, res) => {
          if (err) return done(err);
          let timestamp = new Date(res.body.timestamp);
          expect(res.status).to.equal(200);
          expect(timestamp.toString()).to.equal(testMountains.timestamp.toString());
          expect(res.body.name).to.equal(update.name);
          done();
        });
      });
    });
    describe('with an invalid id', () => {
      it('should return a 404 not found', done => {
        let update = { name: 'updated peak name' }
        request.put(`${url}/api/mountains/averywrongidindeed234`)
        .send(update)
        .end(err => {
          expect(err.status).to.equal(404);
          done();
        });
      });
    });
  });
});
