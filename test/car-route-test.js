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
          expect(res.status).to.equal(200);
          expect(res.body.make).to.equal(exampleCar.make);
          expect(res.body.model).to.equal(exampleCar.model);
          expect(res.body.lotID).to.equal(this.tempLot._id.toString());
          done();
        });
      });
      // });
      describe('POST: shit', function(){
        describe('with an invalid body or none provided', function(){
          it('should return a 400 error', done =>{
            request.post(`${url}/api/lot`)
            .send('stting')
            .set('Content-Type', 'application/json')
            .end((err, res)=> {
              expect(res.status).to.equal(400);
              done();
            });
          });
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
    });
  });

  describe('Get: /api/car/:id', function(){
    describe('with valid car id and body', () => {
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
        Promise.all([
          Lot.remove({}),
          Car.remove({})
        ])
        .then(() => done ())
        .catch(done);

      });

      it('should return a car', done => {
        request.get( `${url}/api/car/${this.tempCar._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('_id');
          // expect(res.body.make).to.equal('test car make');
          done();
        });
      });

      describe('with an invalid id', function(){
        describe('with an invalid id', function(){
          it('should return a 404', done => {
            request.get(`${url}/api/car/6574`)
            .end((err, res) =>{
              expect(res.status).to.equal(404);
              done();
            });
          });
        });
      });
    });
  });

  describe('PUT: /api/car/:id', function() {
    describe('with a valid body', () => {
      before( done => {
        new Car(exampleCar).save()
        .then( car => {
          this.tempCar = car;
          done();
        })
        .catch(done);
      });

      after( done => {
        if (this.tempCar){
          Car.remove({})
          .then( () => done ())
          .catch(done);
          return;
        }
        done();
      });


      it('should return a update car', done => {
        let updatedCar = { model: 'updated model' };

        request.put(`${url}/api/car/${this.tempCar._id}`)
        .send(updatedCar)
        .end((err, res) => {
          if (err) return done(err);
          let timestamp = new Date(res.body.timestamp);
          expect(res.status).to.equal(200);
          expect(res.body.model).to.equal(updatedCar.model);
          expect(res.body).to.have.property('_id');
          expect(res.body._id).to.equal(this.tempCar._id.toString());
          done();
        });
      });
    });
  });
});
  
