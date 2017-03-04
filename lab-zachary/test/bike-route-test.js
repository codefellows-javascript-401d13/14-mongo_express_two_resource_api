'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Quiver = require('../model/quiver.js');
const Bike = require('../model/bike.js');

const PORT = process.env.PORT || 3000;
const url = `localhost:${PORT}`;

require('../server.js');

const exampleBike = {
  name: 'test name',
  description: 'test description',
};

const exampleQuiver = {
  timestamp : new Date(),
  title: 'test title'
};



describe('Bike route tests', function() {
  describe('POST route', function() {
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
        Bike.remove({}),
      ])
      .then(() => done())
      .catch(done);
    });
    describe('With a valid Quiver ID', () => {
      describe('With valid body content',() => {
        it('should return a bike', done => {
          request.post(`${url}/api/quiver/${this.tempQuiver._id}/bike`)
          .send(exampleBike)
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).to.equal(200);
            expect(res.body.name).to.equal(exampleBike.name);
            expect(res.body.quiverID).to.equal(this.tempQuiver._id.toString());
            done();
          });
        });
      });
      describe('With invalid body content', () => {
        it ('should return a 400 error', done => {
          request.post(`${url}/api/quiver/${this.tempQuiver._id}/bike`)
          .send('bad data')
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(err.message).to.equal('Bad Request');
            done();
          });
        });
      });
      describe('with an invalid Quiver ID', () => {
        it('should return a 400 error', done => {
          request.post(`${url}/api/quiver/badID/bike`)
          .send(exampleBike)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(err.message).to.equal('Bad Request');
            done();
          });
        });
      });
    });
  });
  describe('GET api/quiver/:quiverID/bike/:bikeID', function() {
    before( done => {
      new Quiver(exampleQuiver).save()
      .then( quiver => {
        this.tempQuiver = quiver;
        return Quiver.findByIdAndAddBike(this.tempQuiver._id, exampleBike);
      })
      .then( bike => {
        this.tempBike = bike;
        done();
      })
      .catch(done);
    });
    after( done => {
      Promise.all([
        Quiver.remove({}),
        Bike.remove({}),
      ])
      .then(() => done())
      .catch(done);
    });
    describe('with a valid id request', () => {
      it('should return a Bike', done => {
        request(`${url}/api/quiver/${this.tempQuiver._id}/bike/${this.tempBike._id}`)
        .end((err, res) => {
          if(err) return(done);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(exampleBike.name);
          expect(res.body._id).to.not.equal(undefined);
          done();
        });
      });
    });
    describe('with an invalid id request', () => {
      it('should return a 404 error', done => {
        request(`${url}/api/quiver/${this.tempQuiver._id}/bike/badID`)
        .end((err, res) => {
          expect(err.message).to.equal('Not Found');
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
  describe('PUT api/quiver/:quiverID/bike/:bikeID', function() {
    before( done => {
      new Quiver(exampleQuiver).save()
      .then( quiver => {
        this.tempQuiver = quiver;
        return Quiver.findByIdAndAddBike(this.tempQuiver._id, exampleBike);
      })
      .then( bike => {
        this.tempBike = bike;
        done();
      })
      .catch(done);
    });
    after( done => {
      Promise.all([
        Quiver.remove({}),
        Bike.remove({}),
      ])
      .then(() => done())
      .catch(done);
    });
    describe('with a valid id', () => {
      describe('with valid body content', () => {
        it('should return an updated bike', done => {
          request.put(`${url}/api/quiver/${this.tempQuiver._id}/bike/${this.tempBike._id}`)
          .send({name: 'updated name', description: 'updated description'})
          .end((err, res) => {
            if(err) return done(err);
            expect(res.body.name).to.equal('updated name');
            expect(res.status).to.equal(200);
            this.tempBike = res.body;
            done();
          });
        });
      });
      describe('with invalid body content', () => {
        it('should return a 400 error', done => {
          request.put(`${url}/api/quiver/${this.tempQuiver._id}/bike/${this.tempBike._id}`)
          .send('bad data')
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(err.message).to.equal('Bad Request');
            done();
          });
        });
      });
    });
    describe('with invalid id', () => {
      it('should return a 404', done => {
        request.put(`${url}/api/quiver/${this.tempQuiver._id}/bike/badID`)
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(err.message).to.equal('Bad Request');
          done();
        });
      });
    });
  });
  describe('DELETE bike routes', function() {
    before( done => {
      new Quiver(exampleQuiver).save()
      .then( quiver => {
        this.tempQuiver = quiver;
        return Quiver.findByIdAndAddBike(this.tempQuiver._id, exampleBike);
      })
      .then( bike => {
        this.tempBike = bike;

        done();
      })
      .catch(done);
    });
    after( done => {
      Promise.all([
        Quiver.remove({}),
        Bike.remove({}),
      ])
      .then(() => done())
      .catch(done);
    });
    describe('DELETE /api/bike/:bikeID', () => {
      describe('with a valid Bike id', () => {
        it('should return a 204 if Bike is removed and Quiver is updated', done => {
          request.delete(`${url}/api/bike/${this.tempBike._id}`)
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).to.equal(204);
            done();
          });
        });
      });

      describe('with invalid Bike id', () => {
        it('should return a 404', done => {
          request.put(`${url}/api/bike/badID`)
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(err.message).to.equal('Not Found');
            done();
          });
        });
      });
    });
  });
  describe('2nd DELETE bike routes', function() {
    before( done => {
      new Quiver(exampleQuiver).save()
      .then( quiver => {
        this.tempQuiver = quiver;
        return Quiver.findByIdAndAddBike(this.tempQuiver._id, exampleBike);
      })
      .then( bike => {
        this.tempBike = bike;

        done();
      })
      .catch(done);
    });
    after( done => {
      Promise.all([
        Quiver.remove({}),
        Bike.remove({}),
      ])
      .then(() => done())
      .catch(done);
    });
    describe('DELETE /api/quiver/:quiverID/bike/:bikeID', () => {
      describe('with a valid Bike id', () => {
        it('should return a 204 if Bike is removed and Quiver is updated', done => {
          request.delete(`${url}/api/quiver/${this.tempQuiver._id}/bike/${this.tempBike._id}`)
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).to.equal(204);
            done();
          });
        });
      });

      describe('with invalid Bike id', () => {
        it('should return a 404', done => {
          request.put(`${url}/api/bike/badID`)
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(err.message).to.equal('Not Found');
            done();
          });
        });
      });
      describe('with invalid quiver id', () => {
        it('should return a 400', done => {
          request.put(`${url}/api/quiver/badID/bike/${this.tempBike._id}`)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(err.message).to.equal('Bad Request');
            done();
          });
        });
      });
    });
  });
});