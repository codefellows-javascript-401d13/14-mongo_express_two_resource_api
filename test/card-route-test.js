'use strict';

const request = require('superagent');
const expect = require('chai').expect;
const Card = require('../model/card.js');

const PORT = process.env.PORT || 3000;
const url = `http://localhost:${PORT}`;

require('../server.js');

const sampleCard = {
  brand: 'Topps',
  completeSet: false,
  single: true
};

const sampleBaseball = {
  year: '1952',
  player: 'Mickey Mantle'
};

describe('Card Routes', function() {
  describe('POST: /api/card', function() {
    describe('with a valid body', function() {
      after( done => {
        if (this.tempCard) {
          Card.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a card', done => {
        request.post(`${url}/api/card`)
        .send(sampleCard)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.brand).to.equal(sampleCard.brand);
          this.tempCard = res.body;
          done();
        });
      });
    });

    describe('with an invalid body', function() {
      it('should return a 400 error', function(done) {
        let falseSample = { dog: 'cat', beer: 'good'};
        request.post(`${url}/api/card`)
        .send(falseSample)
        .end((err, res) => {
          expect(err.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });
    });

    describe('with no req body', function() {
      it('should return a 400 error', function(done) {
        request.post(`${url}/api/card`)
        .end((err, res) => {
          expect(err.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });
    });
  });

  describe('GET: /api/card:id', function() {
    describe('with a valid body', function() {
      before( done => {
        new Card(sampleCard).save()
        .then( card => {
          this.tempCard = card;
          return Card.findByIdAndAddBaseball(card._id, sampleBaseball);
        })
        .then( baseball => {
          this.tempBaseball = baseball;
          done();
        })
        .catch(done);
      });

      after( done => {
        if (this.tempCard) {
          Card.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a card', done => {
        request.get(`${url}/api/card/${this.tempCard._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.brand).to.equal(sampleCard.brand);
          expect(res.body.baseballArr.length).to.equal(1);
          expect(res.body.baseballArr[0].year).to.equal(sampleBaseball.year);
          done();
        });
      });
    });

    describe('with an invalid id', function() {
      it('should return a 404 error', function(done) {
        let testId = '111222333444555666777888';
        request.get(`${url}/api/card/${testId}`)
        .end((err, res) => {
          expect(err.status).to.equal(404);
          expect(res.status).to.equal(err.status);
          done();
        });
      });
    });

    describe('with no id provided', function() {
      it('should return a 400 error', function(done) {
        request.get(`${url}/api/card`)
        .end((err, res) => {
          expect(err.status).to.equal(400);
          expect(res.status).to.equal(err.status);
          done();
        });
      });
    });
  });

  describe('PUT: /api/card/:id', function() {
    describe('with a valid body', function() {
      before( done => {
        new Card(sampleCard).save()
        .then( card => {
          this.tempCard = card;
          done();
        })
        .catch(done);
      });

      after( done => {
        if (this.tempCard) {
          Card.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return an updated card', done => {
        let updated = { brand: 'Donruss' };

        request.put(`${url}/api/card/${this.tempCard._id}`)
        .send(updated)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.brand).to.equal(updated.brand);
          expect(res.body.single).to.be.true;
          expect(res.body._id).to.equal(this.tempCard._id.toString());
          done();
        });
      });

      describe('with an invalid body', () => {
        it('should return a 400 error', done => {
          let invalid = { blue: 'bike' };
          request.put(`${url}/api/card/${this.tempCard._id}`)
          .send(invalid)
          .end((err, res) => {
            expect(err.status).to.equal(400);
            expect(res.status).to.equal(400);
            done();
          });
        });
      });

      describe('with an invalid id', () => {
        it('should return a 404 error', done => {
          let wrongID = '111222333444555666777888';
          let updated = { brand: 'Donruss' };

          request.put(`${url}/api/card/${wrongID}`)
          .send(updated)
          .end((err, res) => {
            expect(err.status).to.equal(404);
            expect(res.status).to.equal(err.status);
            done();
          });
        });
      });
    });
  });

  describe('DELETE: /api/card/:id', function() {
    describe('with a valid id', function() {
      before( done => {
        new Card(sampleCard).save()
        .then( card => {
          this.tempCard = card;
          done();
        })
        .catch(done);
      });

      after( done => {
        if (this.tempCard) {
          Card.remove({})
          .then( () => done())
          .catch(done);
        }
        done();
      });

      it('should return the deleted card', done => {
        request.delete(`${url}/api/card/${this.tempCard._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.brand).to.equal(sampleCard.brand);
          expect(res.body.completeSet).to.not.be.true;
          done();
        });
      });
    });
  });
});
