'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Library = require('../model/library.js');

const PORT = process.env.PORT || 3000;

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleLibrary = {
  name: 'test library name',
  timestamp: new Date()
};

const exampleJournal = {
  title: 'test journal title',
  entry: 'test journal entry'
};

describe('Library Routes', function(){
  describe('POST: /api/library', function(){
    describe('with a valid body', function(){
      after ( done => {
        if (this.tempLibrary) {
          Library.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a library', done => {
        request.post(`${url}/api/library`)
        .send(exampleLibrary)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test library name');
          this.tempLibrary = res.body;
          done();
        });
      });

      describe('POST: /api/library', function(){
        describe('with an invalid body or none provided', function() {
          it('should return a 400 error', done => {
            request.post(`${url}/api/library`)
          .send('randomstring')
          .set('Content-Type', 'application/json')
          .end((err, res) => {
            expect(res.status).to.equal(400);
            done();
          });
          });
        });
      });
    });
  });




//GET TESTS BELOW
  describe('GET: /api/library/:id', function(){
    describe('with a valid body', function(){
      before( done => {
        new Library(exampleLibrary).save()
        .then( library => {
          this.tempLibrary = library;
          return Library.findByIdAndAddJournal(library._id, exampleJournal);
        })
        .then( journal => {
          this.tempJournal = journal;
          done();
        })
        .catch(done);
      });

      after ( done => {
        if (this.tempLibrary) {
          Library.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a library', done => {
        request.get(`${url}/api/library/${this.tempLibrary._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test library name');
          expect(res.body.journals.length).to.equal(1);
          expect(res.body.journals[0].name).to.equal(exampleJournal.name);
          done();
        });
      });

      describe('GET: /api/library/:id', function () {
        describe('with a invalid id', function() {
          it('should return a 404 error', done => {
            request.get(`${url}/api/library/12345`)
            .end((err, res) => {
              expect(res.status).to.equal(404);
              done();
            });
          });
        });
      });
    });
  });


 //PUT TESTS BELOW
  describe('PUT: /api/library/:id', function(){
    describe('with a valid body', function(){
      before ( done => {
        new Library(exampleLibrary).save()
        .then( library => {
          this.tempLibrary = library;
          done();
        })
        .catch(done);
      });

      after (done => {
        if (this.tempLibrary) {
          Library.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });
      it('should return a list', done =>{
        var updated = { name: 'updated name' };

        request.put(`${url}/api/library/${this.tempLibrary._id}`)
        .send(updated)
        .end((err, res) => {
          if(err) return done(err);
          let timestamp = new Date(res.body.timestamp);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(updated.name);
          expect(timestamp.toString()).to.equal(exampleLibrary.timestamp.toString());
          done();
        });
      });

      it('should return a 400 error', done => {
        let updated = 'strinnngy';
        request.put(`${url}/api/library/${this.tempLibrary._id}`)
        .set('Content-Type', 'application/json')
        .send(updated)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });

      it('should return a 404 error', done => {
        let updated = 'whatever  this is';
        request.put(`${url}/api/library/${this.tempLibrary.what}`)
        .send(updated)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
});
