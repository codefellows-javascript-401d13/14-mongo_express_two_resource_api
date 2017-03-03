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

      it('should return a list', done => {
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
  });
});
