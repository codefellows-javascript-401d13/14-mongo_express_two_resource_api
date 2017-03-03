'use strict';

const 
  expect = require('chai').expect,
  request = require('superagent');

const 
  Employee = require('../model/employee.js'),
  Dev = require('../model/dev.js');

const 
  PORT = process.env.PORT || 3000,
  url = `http://localhost:${PORT}`;

require('../server.js');

const 
  exampleEmployee = {
    name: 'test name',
    timestamp: new Date()
  },
  exampleDev = {
    name: 'khalid',
    langauge: 'Js'
  };

describe('Employee Routes', function(){
  
  describe('POST /api/employee', function(){
    describe('with a valid body', function(){
      after( done => {
        if(this.tempEmployee){
          Employee.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });
      it('should return a list', done => {
        request.post(`${url}/api/employee`)
        .send(exampleEmployee)
        .end((err, res)=>{
          if(err) return done();
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test name');
          this.tempEmployee = res.body;
          done();
        });
      });
    });
  });
  describe('GET /api/employee/:id', function(){
    describe('with a valid body', function(){
      before( done => {
        new Employee(exampleEmployee).save()
        .then(employee => {
          this.tempEmployee = employee;
          return Employee.findByIdAndAddDev(employee._id, exampleDev);
        })
        .then( dev => {
          this.tempDev = dev;
          done();
        })
        .catch(done);
      });
      after( done => {
        if(this.tempEmployee){
          Employee.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });
      it('should return an employee', done => {
        request.get(`${url}/api/employee/${this.tempEmployee._id}`)
        .end((err, res) => {
          console.log('>>>>>>>>>>>>',res.status);
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test name');
          expect(res.body.devs.length).to.equal(1);
          expect(res.body.devs[0].name).to.equal(exampleDev.name);
          done();
        });
      });
    });
  });
  // describe('PUT /api/employee/:id', function(){
  //   describe('with a valid body', function(){
  //     before( done => {
  //       new Employee(exampleEmployee).save()
  //       .then( employee => {
  //         this.tempEmployee = employee;
  //         done();
  //       })
  //       .catch(done);
  //     });
  //     it('should return an employee', done => {
  //       var updated = {name: 'Homer'};
  //       request.put(`${url}/api/employee/${this.tempEmployee._id}`)
  //       .send(updated)
  //       .end((err, res) => {
  //         if(err) return done(err);
  //         let timestamp = new Date(res.body.timestamp);
  //         expect(res.status).to.equal(200);
  //         expect(res.body.name).to.equal(updated.name);
  //         expect(timestamp.toString()).to.equal(exampleEmployee.timestamp.toString());
  //         done();
  //       });
  //     });
  //   });
  // });
});