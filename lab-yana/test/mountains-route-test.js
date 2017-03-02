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
    describe('with a valid body', () => {
      afterEach(done => {
        if (this.tempMountains) {
          Mountains.remove({})
          .catch(done)
          .then( () => done());
        }
        done(); //in case we don't go in the if block;
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
  });
});
