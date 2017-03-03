'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Quiver = require('../model/quiver.js');

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

describe('Quiver Routes', function() {
  describe('POST: /api/quiver', function() {
    describe('with a valid body', function() {
      after( done => {
        if(this.tempQuiver) {
          Quiver.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });
      it('should return a quiver', done => {
        request.post(`${url}/api/quiver`)
        .send(exampleQuiver)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.owner).to.equal('nikko');
          this.tempQuiver = res.body;
          done();
        });
      });
    });
  });

  describe('GET: /api/quiver/:id', function() {
    describe('with a valid id', function() {
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
      it('should return a quiver', done => {
        request.get(`${url}/api/quiver/${this.tempQuiver._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.owner).to.equal('nikko');
          done();
        });
      });
    });
  });

  describe('PUT /api/quiver/:id', function () {
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
      it('should return a quiver', done => {
        let updateQuiver = { owner: 'nikko\'s girlfriend' };
        request.put(`${url}/api/quiver/${this.tempQuiver._id}`)
        .send(updateQuiver)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.owner).to.equal('nikko\'s girlfriend');
          done();
        });
      });
    });
  });

  describe('DELETE: /api/quiver/:id', function() {
    describe('with a valid id', function() {
      before( done => {
        new Quiver(exampleQuiver).save()
        .then( quiver => {
          this.tempQuiver = quiver;
          done();
        })
        .catch(done);
      });
      it('should return with no content', done => {
        request.delete(`${url}/api/quiver/${this.tempQuiver._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(204);
          done();
        });
      });
    });
  });
});
