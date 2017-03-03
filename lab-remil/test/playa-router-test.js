'use strict';
'use strict';

const expect = require('chai').expect;
const request = require('superagent');

const Squad = require('../model/squad.js');
const Playa = require('../model/playa.js');

const PORT = process.env.PORT || 3000;
const url = `http://localhost:${PORT}`;

require('../server.js');

const bsquad = {
  squadName: 'jv squad',
};

const bplaya = {
  playaName: 'weak',
  swagLevel: 0,
};

describe('Playa Rizzoutes', function() {
  describe('runnin\' a POST route @ /api/squad/:squadID/playa', function() {
    describe('with dat good body', function() {
      before( done => {
        new Squad(bsquad).save()
        .then( squad => {
          this.tempSquad = squad;
          done();
        })
        .catch(done);
      });

      after( done => {
        if (this.tempSquad) {
          Promise.all([
            Squad.remove({}),
            Playa.remove({}),
          ])
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('betta return a playa', done => {
        request.post(`${url}/api/squad/${this.tempSquad._id}/playa`)
        .send(bplaya)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('_id');
          expect(res.body.squadID).to.equal(this.tempSquad._id.toString());
          expect(res.body.playaName).to.equal(bplaya.playaName);
          expect(res.body.swagLevel).to.equal(bplaya.swagLevel);
          done();
        });
      });
    });
  });

  describe('runnin\' a GET route @ /api/playa/:id', function() {
    describe('with dat good id', function() {
      before( done => {
        new Squad(bsquad).save()
        .then( squad => {
          this.tempSquad = squad;
          return Squad.findByIdAndAddPlaya(squad._id, bplaya);
        })
        .then( playa => {
          this.tempPlaya = playa;
          done();
        })
        .catch(done);
      });

      after( done => {
        if (this.tempSquad) {
          Promise.all([
            Squad.remove({}),
            Playa.remove({}),
          ])
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('betta return a playa', done => {
        request.get(`${url}/api/playa/${this.tempPlaya._id}`)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('_id');
          expect(res.body.squadID).to.equal(this.tempSquad._id.toString());
          expect(res.body.playaName).to.equal(bplaya.playaName);
          expect(res.body.swagLevel).to.equal(bplaya.swagLevel);
          done();
        });
      });
    });
  });
});
