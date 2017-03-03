'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Lot = require('../model/lot.js');
const Car = require('../model/car.js');

const PORT = process.env.PORT || 8000;

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleLot = {
  name: 'example lot',
  timestamp: new Date()
};

const exampleCar = {
  make: 'test car make',
  model: 'test car model'
};

describe('Lot Routes', function(){
  describe('POST: /api/lot', function(){
    describe('with a valid body', function(){
      after( done => {
        if (this.tempLot){
          Lot.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a lot', done => {
        request.post(`${url}/api/lot`)
        .send(exampleLot)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('example lot');
          this.tempLot = res.body;
          done();
        });
      });


      describe('with an invalid id or none provided', function() {
        it('should return a 404 error', done => {
          request.post(`${url}/api/lot/2345`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
        });
      });

      describe('with an invalid body or none provided', function() {
        it('should return a 400 error', done => {
          request.post(`${url}/api/lot`)
      .send('tdd makes me angry')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        // expect(res.body.name).to.equal('examp');
        expect(res.status).to.equal(400);
        done();
      });
        });
      });
    });

    describe('GET: /api/lot/:id', function(){
      describe('with valid body', function(){
        before( done => {
          new Lot(exampleLot).save()
        .then( lot => {
          this.tempLot = lot;
          return Lot.findByIdAndAddCar(lot._id, exampleCar);
        })
        .then( car => {
          this.tempCar = car;
          done();
        })
        .catch(done);
        });

        after( done => {
          if (this.tempLot) {
            Lot.remove({})
        .then( () => done())
        .catch(done);
            return;
          }
          done();
        });

        it('should return a lot', done => {
          request.get( `${url}/api/lot/${this.tempLot._id}`)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('example lot');
        expect(res.body.cars.length).to.equal(1);
        expect(res.body.cars[0].make).to.equal(exampleCar.make);
        done();
      });
        });
      });
    });


    describe('PUT: /api/lot/:id', function() {
      describe('with a valid body', function() {
        before( done => {
          new Lot(exampleLot).save()
        .then( lot => {
          this.tempLot = lot;
          done();
        })
        .catch(done);
        });

        after( done => {
          if (this.tempLot) {
            Lot.remove({})
          .then( () => done())
          .catch(done);
            return;
          }
          done();
        });

        it('should return a lot', done => {
          var updated = { name: 'updated name' };

          request.put(`${url}/api/lot/${this.tempLot._id}`)
        .send(updated)
        .end((err, res) => {
          if (err) return done(err);
          let timestamp = new Date(res.body.timestamp);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(updated.name);
          expect(timestamp.toString()).to.equal(exampleLot.timestamp.toString());
          done();
        });
        });
      });
    });
  });
});
