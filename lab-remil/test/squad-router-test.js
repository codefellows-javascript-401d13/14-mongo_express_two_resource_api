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

describe('Squad Rizzoutes', function() {
  describe('runnin\' a POST route @ /api/squad', function() {
    describe('with dat good body', function() {
      after( done => {
        if (this.tempSquad) {
          Squad.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('betta return a squad', done => {
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

  describe('runnin\' a GET route @ /api/squad/:id', function() {
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

      it('betta return a squad', done => {
        request.get(`${url}/api/squad/${this.tempSquad._id}`)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(200);
          expect(res.body.squadName).to.equal(bsquad.squadName);
          expect(res.body).to.have.property('_id');
          expect(res.body.playas.length).to.equal(1);
          expect(res.body.playas[0].playaName).to.equal(bplaya.playaName);
          done();
        });
      });
    });
  });

  describe('runnin\' a PUT route @/api/squad/:id', function() {
    describe('with dat good id and body', function() {
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

      it('betta return a fresh squad', done => {
        let asquad = { squadName: 'terror squad' };
        request.put(`${url}/api/squad/${this.tempSquad._id}`)
        .send(asquad)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(200);
          expect(res.body._id).to.equal(this.tempSquad._id.toString());
          expect(res.body.squadName).to.equal(asquad.squadName);
          done();
        });
      });
    });
  });
});
