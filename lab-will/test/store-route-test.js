'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Store = require('../model/store.js');
const Employee = require('../model/employee.js');

const PORT = process.env.PORT || 3000;

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleStore = {
  name: 'test store',
  timestamp: new Date()
};

const exampleEmployee = {
  name: 'test employee',
  content: 'test content'
};

describe('Store Routes', function() {
  describe('POST: /api/store', function() {
    describe('with a valid body', function() {
      after( done => {
        if(this.tempStore){
          Store.remove({})
          .then( () => done() )
          .catch(done);
          return;
        }
        done;
      });

      it('should return a store', function() {
        request.post(`${url}/api/store`)
        .send(exampleStore)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test store');
          this.tempStore = res.body;
          done();
        });
      });
    });
  });

  describe('GET: /api/store/:id', function() {
    describe('with a valid body', function() {
      before( done => {
        new Store(exampleStore).save()
        .then( store => {
          this.tempStore = store;
          return Store.findByIdAndAddEmployee(store._id, exampleEmployee);
        })
        .then( employee => {
          this.tempEmployee = employee;
          done();
        })
        .catch(done);
      });

      after( done => {
        if(this.tempStore){
          Store.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a store', function() {
        request.get(`${url}/api/store/${this.tempStore._id}`)
        .end((end, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test store');
          expect(res.body.employees.length).to.equal(1);
          expect(res.body.employees[0].name).to.equal(exampleStore.name);
          done();
        });
      });
    });
  });

  describe('PUT: /api/store/:id', function() {
    describe('with a valid body', function() {
      before( done => {
        new Store(exampleStore).save()
        .then( store => {
          this.tempStore = store;
          done();
        })
        .catch(done);
      });

      after( done => {
        if (this.tempStore){
          Store.remove({})
          .then( () => done() )
          .catch(done);
          return;
        }
        done();
      });

      it('should return a store', function() {
        var updated = { name: 'updated name' };

        request.put(`${url}/api/store/${this.tempStore._id}`)
        .send(updated)
        .end((err, res) => {
          if(err) return done(err);
          let timestamp = new Date(res.body.timestamp);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(updated.name);
          expect(timestamp.toString()).to.equal(exampleStore.timestamp.toString());
          done();
        });
      });
    });
  });
});
