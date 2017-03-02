'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Lot = require('../model/lot.js');
const Car = require('../model/car.js');

const PORT = process.env.PORT || 8000;

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleCar = {
  make: 'test car make',
  model: 'test car model'
};

const exampleLot = {
  name: 'example lot',
  timestamp: new Date()
};

describe('Car routes', function(){
  describe('POST: /api/lot/:lotID/car', function(){
    describe('with valid lot id and car body', () => {
      before( done => {
        new Lot(exampleLot).save()
        .then( lot => {
          this.tempLot = lot;
          done();
        })
        .catch(done);
      });

      after( done => {
        Promise.all([
          Lot.remove({}),
          Car.remove({})
        ])
        .then(() => done ())
        .catch(done);
      });

      it('should return a car', done => {
        request.post(`${url}/api/lot/${this.tempLot.id}/car`)
        .send(exampleCar)
        .end((err, res) => {
          if (err) return done (err);
          expect(res.body.make).to.equal(exampleCar.make);
          expect(res.body.model).to.equal(exampleCar.model);
          expect(res.body.lotID).to.equal(this.tempLot._id.toString());
          done();
        });
      });
    });
  });
});
