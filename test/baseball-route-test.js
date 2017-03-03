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
});
