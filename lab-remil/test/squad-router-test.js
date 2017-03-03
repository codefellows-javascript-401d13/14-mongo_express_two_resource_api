'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Promise = require('bluebird');

const Squad = require('../model/squad.js');
const Playa = require('../model/playa.js');

const PORT = process.env.PORT || 3000;
const url = `http://localhost:${PORT}`;

require('../server.js');

const bsquad = {
  squadName: 'jv squad',
};

describe('Squad Rizzoutes', function() {
  describe('POST: /api/squad', function() {
    describe('with a gucci id', function() {
      after( done => {
        if (this.tempSquad) {
          Squad.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('best return a gucci squad', done => {
        request.post(`${url}/api/squad`)
        .send(bsquad)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(200);
          expect(res.body.squadName).to.equal(bsquad.squadName);
          expect(res.body).to.have.property('_id');
          this.tempSquad = res.body;
          done();
        });
      });
    });
  });
});
