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

    describe('with dat bad body', function() {
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

      it('betta return a 400', done => {
        request.post(`${url}/api/squad/${this.tempSquad._id}/playa`)
        .send('bad body')
        .end((err, res) => {
          expect(res.status).to.equal(400);
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

    describe('with dat bad id', function() {
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

      it('betta return a 404', done => {
        request.get(`${url}/api/playa/badID`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('runnin\' a PUT route @ /api/playa/:id', function() {
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

      it('betta return a fresh playa', done => {
        let aplaya = { playaName: 'too nice', swagLevel: 100 };
        request.put(`${url}/api/playa/${this.tempPlaya._id}`)
        .send(aplaya)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(200);
          expect(res.body._id).to.equal(this.tempPlaya._id.toString());
          expect(res.body.squadID).to.equal(this.tempSquad._id.toString());
          expect(res.body.playaName).to.equal(aplaya.playaName);
          expect(res.body.swagLevel).to.equal(aplaya.swagLevel);
          done();
        });
      });
    });
  });

  describe('runnin\' a DELETE route @ /api/playa/:id', function() {
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

      it('betta return a 204 and take him off his squad', done => {
        request.delete(`${url}/api/playa/${this.tempPlaya._id}`)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(204);
          done();
        });
      });
    });
  });
});
