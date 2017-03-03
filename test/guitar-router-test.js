'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Quiver = require('../model/quiver.js');
const Guitar = require('../model/guitar.js');

const PORT = process.env.PORT || 3000;
const url = `http://localhost:${PORT}`;

require('../server.js');

const exampleQuiver = {
  owner: 'nikko',
  timestamp: new Date()
};

const exampleGuitar = {
  name: 'stratocaster',
  type: 'electric',
  make: 'fender'
};

describe('Guitar Routes', function() {
  describe('POST: /api/quiver/:quiverID/guitar', function() {
    describe('with a valid body', function() {
      before( done => {
        new Quiver(exampleQuiver).save()
        .then( quiver => {
          this.tempQuiver = quiver;
          done();
        })
        .catch(done);
      });
      after( done => {
        Promise.all([
          Quiver.remove({}),
          Guitar.remove({})
        ])
        .then(() => done())
        .catch(done);
      });
      it('should return a note', done => {
        request.post(`${url}/api/quiver/${this.tempQuiver._id}/guitar`)
        .send(exampleGuitar)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('stratocaster');
          expect(res.body.quiverID.toString()).to.equal(this.tempQuiver._id.toString());
          done();
        });
      });
    });
  });
  describe('GET: /api/quiver/:quiverID/guitar/:guitarID', function() {
    describe('with a valid id', function() {
      before( done => {
        new Quiver(exampleQuiver).save()
        .then( quiver => {
          this.tempQuiver = quiver;
          return Quiver.findByIdAndAddGuitar(quiver._id, exampleGuitar)
          .then( guitar => {
            this.tempGuitar = guitar;
            this.tempQuiver.guitars.push(guitar._id);
            done();
          })
          .catch(done);
        })
        .catch(done);
      });
      after( done => {
        if(this.tempQuiver) {
          Quiver.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });
      it('should return a guitar', done => {
        request.get(`${url}/api/quiver/${this.tempQuiver._id}/guitar/${this.tempGuitar._id}`)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('stratocaster');
          expect(res.body.type).to.equal('electric');
          expect(res.body.make).to.equal('fender');
          done();
        });
      });
    });
  });
  describe('PUT /api/quiver/:quiverID/guitar/guitarID', function () {
    describe('with a valid body', function() {
      before( done => {
        new Quiver(exampleQuiver).save()
        .then( quiver => {
          this.tempQuiver = quiver;
          return Quiver.findByIdAndAddGuitar(quiver._id, exampleGuitar);
        })
        .then( guitar => {
          this.tempGuitar = guitar;
          done();
        })
        .catch(done);
      });
      after( done => {
        if(this.tempQuiver) {
          Quiver.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });
      it('should return an updated guitar', done => {
        let updateGuitar = { name: 'les paul', make: 'gibson'};
        request.put(`${url}/api/quiver/${this.tempQuiver._id}/guitar/${this.tempGuitar._id}`)
        .send(updateGuitar)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(updateGuitar.name);
          expect(res.body.make).to.equal(updateGuitar.make);
          done();
        });
      });
    });
  });
  describe('DELETE: /api/quiver/:quiverID/guitar/:guitarID', function() {
    describe('with a valid id', function() {
      before( done => {
        new Quiver(exampleQuiver).save()
        .then( quiver => {
          this.tempQuiver = quiver;
          return Quiver.findByIdAndAddGuitar(quiver._id, exampleGuitar)
          .then( guitar => {
            this.tempGuitar = guitar;
            this.tempQuiver.guitars.push(guitar._id);
            done();
          })
          .catch(done);
        })
        .catch(done);
      });
      it('should return with no content', done => {
        request.delete(`${url}/api/quiver/${this.tempQuiver._id}/guitar/${this.tempGuitar._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(204);
          done();
        });
      });
    });
  });
});
