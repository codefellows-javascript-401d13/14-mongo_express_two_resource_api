'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Quiver = require('../model/quiver.js');

const PORT = process.env.PORT || 3000;
const url = `localhost:${PORT}`;

require('../server.js');

const sampleQuiver = {
  title:'original test name',
  timestamp: new Date(),
};
const sampleBike = {
  name:'test bike',
  description:'test description'
};

describe('Quiver Route tests', function() {
  describe('GET route tests', function() {
    describe('with a valid ID', function() {
      before( done => {
        new Quiver(sampleQuiver).save()
        .then( quiver => {
          this.tempQuiver = quiver;
          return Quiver.findByIdAndAddBike(this.tempQuiver._id, sampleBike);
        })
        .then( bike => {
          this.tempBike = bike;
          done();
        })
        .catch(done);
      });
      after( done => {
        if(this.tempQuiver){
          Quiver.remove({})//empties DB!!
          .then( () => done ())
          .catch(done);
          return;
        }
      });
      it('should return a quiver', done => {
        request.get(`${url}/api/quiver/${this.tempQuiver._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(this.tempQuiver.name);
          expect(res.body.bikes.length).to.equal(1);
          expect(res.body.bikes[0].name).to.equal(this.tempBike.name);
          done();
        });
      });
    });
    describe('with an invalid ID', function () {
      it('should throw a 404', done => {
        request.get(`${url}/api/quiver/NotAnID`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(err.message).to.equal('Not Found');
          done();
        });
      });
    });
  });

  describe('POST route tests', function() {
    describe('with a valid body', function() {
      after( done => {
        if(this.tempQuiver){
          Quiver.remove({})//empties DB!!
          .then( () => done ())
          .catch(done);
          return;
        }
      });
      it('should return a quiver', done => {
        request.post(`${url}/api/quiver`)
        .send(sampleQuiver)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(sampleQuiver.name);
          expect(res.body._id).to.not.equal(undefined);
          this.tempQuiver = res.body;
          done();
        });
      });
    });
    describe('with an missing or invalid body', function() {
      it('should return a 400 error', done => {
        request.post(`${url}/api/quiver`)
        .send({badTitle: 'title'})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(err.message).to.equal('Bad Request');
          done();
        });
      });
    });
  });

  describe('PUT route tests', function () {
    describe('with a valid id', function () {
      before( done => {
        sampleQuiver.timestamp = new Date();
        new Quiver(sampleQuiver).save()
        .then( quiver => {
          this.tempQuiver = quiver;
          done();
        })
        .catch(done);
      });
      after( done => {
        if(this.tempQuiver){
          Quiver.remove({})//empties DB!!
          .then( () => done ())
          .catch(done);
          return;
        }
      });
      describe('with a valid body', () => {
        it('should return an updated note', done => {
          request.put(`${url}/api/quiver/${this.tempQuiver._id}`)
          .send({title: 'updated title'})
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.title).to.equal('updated title');
            this.tempQuiver = res.body;
            done();
          });
        });
      });
      describe('with an invalid body', () => {
        it('should return a 400 error', done => {
          request.put(`${url}/api/quiver/${this.tempQuiver._id}`)
          .send('bad data')
          .end((err, res) => {
            expect(err.message).to.equal('Bad Request');
            expect(res.status).to.equal(400);
            done();
          });
        });
      });
    });
  });
  describe('DELETE route test', function() {
    describe('with a valid ID', function() {
      before( done => {
        sampleQuiver.timestamp = new Date();
        new Quiver(sampleQuiver).save()
        .then( quiver => {
          this.tempQuiver = quiver;
          done();
        })
        .catch(done);
      });
      it('should return 204', done => {
        request.delete(`${url}/api/quiver/${this.tempQuiver._id}`)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(204);
         // expect(res.body).to.equal('');
          done();
        });
      });
    });
    describe('with an invalid ID', function() {
      it('should return with a 404', done => {
        request.delete(`${url}/api/quiver/badID`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
         // expect(res.body).to.equal('');
          done();
        });
      });
    });
  });
});