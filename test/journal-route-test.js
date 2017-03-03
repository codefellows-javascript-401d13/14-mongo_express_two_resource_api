'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Library = require('../model/library.js');
const Journal = require('../model/journal.js');

const PORT = process.env.PORT || 3000;

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleJournal = {
  title: 'test journal title',
  entry: 'test journal entry'
};

const exampleLibrary = {
  name: 'test example library',
  timestamp: new Date()
};

describe('Journal Routes', function(){
  describe('POST: /api/library/:libraryID/journal', function() {
    describe('with a valid library id and journal body', () => {
      before( done => {
        new Library(exampleLibrary).save()
        .then( library => {
          this.tempLibrary = library;
          done();
        })
        .catch(done);
      });

      after( done => {
        Promise.all([
          Library.remove({}),
          Journal.remove({})
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return a journal', done => {
        request.post(`${url}/api/library/${this.tempLibrary.id}/journal`)
        .send(exampleJournal)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.title).to.equal(exampleJournal.title);
          expect(res.body.entry).to.equal(exampleJournal.entry);
          expect(res.body.libraryID).to.equal(this.tempLibrary._id.toString());
          done();
        });
      });

      describe('POST: /api/journal', function(){
        describe('with an invalid body or none provided', function(){
          it('should return a 400 error', done =>{
            request.post(`${url}/api/library`)
            .send('justthisstring')
            .set('Content-Type', 'application/json')
            .end((err, res)=> {
              expect(res.status).to.equal(400);
              done();
            });
          });
        });
      });
    });
  });

  describe('GET: /api/journal/:id', function(){
    describe('with a valid body', () => {
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
      after( done => {
        Promise.all([
          Library.remove({}),
          Journal.remove({})
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return a journal', done => {
        request.get(`${url}/api/journal/${this.tempJournal._id}`)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('_id');
          // expect(res.body.e).to.equal(exampleJournal.entry);
          done();
        });
      });

      describe('GET: /api/journal', function(){
        describe('with an invalid id', function(){
          it('should return a 404 error', done => {
            request.get(`${url}/api/journal/123456`)
            .end((err, res)=>{
              expect(res.status).to.equal(404);
              done();
            });
          });
        });
      });
    });
  });
});
