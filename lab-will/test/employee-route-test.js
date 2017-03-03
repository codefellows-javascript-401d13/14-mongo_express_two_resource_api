'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Store = require('../model/store.js');
const Employee = require('../model/employee.js');

const PORT = process.env.PORT || 3000;

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleEmployee = {
  name: 'test employee',
  content: 'test employee content'
};

const exampleStore = {
  name: 'example store',
  timestamp: new Date()
};

describe('Employee Routes', function() {
  describe('POST: /api/store/:storeID/employee', function() {
    describe('with a valid store id and employee body', () => {
      before( done => {
        new Store(exampleStore).save()
        .then( store => {
          this.tempStore = store;
          done();
        })
        .catch(done);
      });

      after( done => {
        Promise.all([
          Store.remove({}),
          Employee.remove({})
        ])
        .then( () => done() )
        .catch(done);
      });

      it('should return an employee', done => {
        request.post(`${url}/api/store/${this.tempStore.id}/employee`)
        .send(exampleEmployee)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.body.name).to.equal(exampleEmployee.name);
          expect(res.body.storeID).to.equal(this.tempStore._id.toString());
          done();
        });
      });
    });
  });
});
