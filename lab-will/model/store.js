'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');
const debug = require('debug')('employee:list');
const Schema = mongoose.Schema;

const Employee = require('./employee.js');

const storeSchema = Schema({
  name: { type: String, required: true},
  timestamp: { type: Date, required: true},
  employees: [{ type: Schema.Types.ObjectId, ref: 'employee'}]
});

const Store = module.exports = mongoose.model('store', storeSchema);

Store.findByIdAndAddEmployee = function(id, employee) {
  debug('findByIdAndAddEmployee');

  return Store.findById(id)
  .catch( err => Promise.reject(createError(404, err.message)))
  .then( store => {
    employee.storeID = store._id;
    this.tempStore = store;
    return new Employee(employee).save();
  })
  .then( not => {
    this.tempStore.employees.push(employee._id);
    this.tempEmployee = employee;
    return this.tempStore.save();
  })
  .then( () => {
    return this.tempEmployee;
  });
};
