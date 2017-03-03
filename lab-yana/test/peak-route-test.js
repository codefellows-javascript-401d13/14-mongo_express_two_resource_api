'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Mountains = require('../model/mountains.js');
const Peak = require('../model/peak.js');
const url = 'http://localhost:3003';

require('../server.js');

const testPeak = {
  name: 'test peak name',
  content: 'test peak content'
};

const testMountains = {
  name: 'test mountains name',
  timestamp: new Date()
};

describe('Peak Routes', function() {
  describe('POST: /api/mountains/:mountainsID/peak', function() {
    beforeEach(done => {
      new Mountains(testMountains).save()
      .then(mountains => {
        this.tempMountains = mountains;
        done();
      })
      .catch(done);
    });
    afterEach(done => {
      Promise.all([
        Mountains.remove({}),
        Peak.remove({})
      ])
      .then( () => done())
      .catch(done);
    });
    describe('with a valid mountainsID and peak body', () => {
      it('should return a peak', done => {
        request.post(`${url}/api/mountains/${this.tempMountains._id}/peak`)
        .send(testPeak)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(testPeak.name);
          expect(res.body.content).to.equal(testPeak.content);
          expect(res.body.mountainsID).to.equal(this.tempMountains._id.toString());
          done();
        });
      });
    });
    describe('with an invalid body', () => {
      it('should return a 400 bad request error', done => {
        request.post(`${url}/api/mountains/${this.tempMountains._id}/peak`)
        .end(err => {
          console.log('this temp mountains inside it', this.tempMountains);
          expect(err.status).to.equal(400);
          done();
        });
      });
    });
    describe('with an invalid id', () => {
      it('should return a 404 not found error', done => {
        request.post(`${url}/api/mountains/n0tac0rrect1d0dear/peak`)
        .send(testPeak)
        .end(err => {
          expect(err.status).to.equal(404);
          done();
        });
      });
    });
  });
  describe('GET: /api/peak/:id', function() {
    beforeEach(done => {
      request.post(`${url}/api/mountains`)
      .send(testMountains)
      .then(res => {
        this.tempMountains = res.body;
        request.post(`${url}/api/mountains/${this.tempMountains._id}/peak`)
        .send(testPeak)
        .then(res => {
          this.tempPeak = res.body;
          done();
        })
        .catch(done);
      })
      .catch(done);
    });
    afterEach(done => {
      Promise.all([
        Mountains.remove({}),
        Peak.remove({})
      ])
      .then( () => done())
      .catch(done);
    });
    describe('with a valid id', () => {
      it('should return a peak', done => {
        request.get(`${url}/api/peak/${this.tempPeak._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(testPeak.name);
          expect(res.body.content).to.equal(testPeak.content);
          expect(res.body._id).to.equal(this.tempPeak._id);
          done();
        });
      });
    });
    describe('with an invalid id', () => {
      it('should return a 404 not found error', done => {
        request.get(`${url}/api/peak/0hdearwr0ng1d`)
        .end(err => {
          expect(err.status).to.equal(404);
          done();
        });
      });
    });
  });
  describe('DELETE: /api/peak/:id', () => {
    describe('with a valid id', () => {
      before(done => {
        request.post(`${url}/api/mountains`)
        .send(testMountains)
        .then(res => {
          this.tempMountains = res.body;
          request.post(`${url}/api/mountains/${this.tempMountains._id}/peak`)
          .send(testPeak)
          .then(res => {
            this.tempPeak = res.body;
            done();
          })
          .catch(done);
        })
        .catch(done);
      });
      afterEach(done => {
        Promise.all([
          Mountains.remove({}),
          Peak.remove({})
        ])
        .then( () => done())
        .catch(done);
      });
      it('should return a 204 status code', done => {
        request.delete(`${url}/api/peak/${this.tempPeak._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(204);
          done();
        });
      });
    });
    describe('with an invalid id', function() {
      it('should return a 404 not found error', done => {
        request.delete(`${url}/api/peak/0hdamnwr0ngr0ut3`)
        .end(res => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
  describe('PUT: /api/peak/:id', function() {
    beforeEach(done => {
      request.post(`${url}/api/mountains`)
      .send(testMountains)
      .then(res => {
        this.tempMountains = res.body;
        request.post(`${url}/api/mountains/${this.tempMountains._id}/peak`)
        .send(testPeak)
        .then(res => {
          this.tempPeak = res.body;
          done();
        })
        .catch(done);
      })
      .catch(done);
    });
    afterEach(done => {
      Promise.all([
        Mountains.remove({}),
        Peak.remove({})
      ])
      .then( () => done())
      .catch(done);
    });
    describe('with a valid body and id', () => {
      it('should return an updated peak', done => {
        let update = { name: 'new test peak name', content: 'new test peak content'};
        request.put(`${url}/api/peak/${this.tempPeak._id}`)
        .send(update)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(update.name);
          expect(res.body.content).to.equal(update.content);
          done();
        });
      });
    });
    describe('with an invalid body', () => {
      it('should return a 400 bad request error', done => {
        request.put(`${url}/api/peak/${this.tempPeak._id}`)
        .end(err => {
          expect(err.status).to.equal(400);
          done();
        });
      });
    });
    describe('with an invalid id', () => {
      it('should return a 404 not found', done => {
        let update = { name: 'new test peak name', content: 'new test peak content'};
        request.put(`${url}/api/peak/wr0ngaga1ndamm1t`)
        .send(update)
        .end(err => {
          expect(err.status).to.equal(404);
          done();
        });
      });
    });
  });
});








// before(done => {
//   new Peak(peak).save()
//   .then(peak => {
//     this.tempPeak = peak;
//     done();
//   })
//   .catch(done);
// });
// after(done => {
//   if (this.tempPeak) {
//     Peak.remove({})
//     .then( () => done())
//     .catch(done);
//   }
//   done();
// });
// });
