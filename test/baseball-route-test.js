'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Card = require('../model/card.js');
const Baseball = require('../model/card.js');

const PORT = process.env.PORT || 3000;

require('../server.js');

const url = `http://localhost:${PORT}`;

const sampleCard = {
  brand: 'Topps',
  completeSet: false,
  single: true
};

const sampleBaseball = {
  year: '1952',
  player: 'Mickey Mantle'
};

describe('Baseball Routes', function() {
  describe('POST: /api/card/:cardId/baseball', function() {
    describe('with a valid body', () => {
      before( done => {
        new Card(sampleCard).save()
        .then( card => {
          this.tempCard = card;
          done();
        })
        .catch(done);
      });

      after( done => {
        Promise.all([
          Card.remove({}),
          Baseball.remove({})
        ])
        .then( () => done())
        .catch(done);
      });

      it('should return a baseball', done => {
        request.post(`${url}/api/card/${this.tempCard._id}/baseball`)
        .send(sampleBaseball)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.year).to.equal(sampleBaseball.year);
          expect(res.body.player).to.equal(sampleBaseball.player);
          expect(res.body.cardId).to.equal(this.tempCard._id.toString());
          done();
        });
      });
    });
  });

  describe('GET: /api/baseball/:id', function() {
    describe('with a valid id', function() {
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

      it('should return a note', done => {
        request.get(`${url}/api/baseball/${this.tempBaseball._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.year).to.equal(sampleBaseball.year);
          expect(res.body.cardId).to.equal(this.tempCard._id.toString());
          done();
        });
      });
    });
  });

  describe('PUT: /api/baseball/:id', function() {
    describe('with a valid id', function() {
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

      it('should return an updated baseball', done => {
        let updated = { player: 'Hank Aaron' };
        request.put(`${url}/api/baseball/:id`)
        .send(updated)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.player).to.equal(updated.player);
          expect(res.body.id).to.equal(this.tempBaseball._id.toString());
        });
      });
    });
  });
});
