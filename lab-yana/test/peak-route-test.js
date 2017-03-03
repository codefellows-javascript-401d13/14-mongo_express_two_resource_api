'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Mountains = require('../model/mountains.js');
const Peak = require('../model/peak.js');
const url = 'http://localhost:3003';

require('../server.js');

const testPeak = {
  name: 'test peak name',
  content: 'test peak content'
};

const testMountains = {
  name: 'test mountains name',
  timestamp: new Date()
};

describe('Peak Routes', function() {
  describe('POST: /api/mountains/:mountainsID/peak', function() {
    describe('with a valid mountainsID and peak body', function() {
      before(done => {
        new Mountains(testMountains).save()
        .then(mountains => {
          this.tempMountains = mountains;
          done();
        })
        .catch(done);
      });
      after(done => {
        Promise.all([
          Mountains.remove({}),
          Peak.remove({})
        ])
        .then( () => done())
        .catch(done);
      });
      it('should return a peak', done => {
        request.post(`${url}/api/mountains/${this.tempMountains._id}/peak`)
        .send(testPeak)
        .end((err, res) => {
          if (err) return done(err);
          console.log('res.body', res.body);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(testPeak.name);
          expect(res.body.content).to.equal(testPeak.content);
          expect(res.body.mountainsID).to.equal(this.tempMountains._id.toString());
          done();
        });
      });
    });
  });
});
