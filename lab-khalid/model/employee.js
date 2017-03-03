'use strict';


const  
  mongoose = require('mongoose'),
  createError = require('http-errors'),
  debug = require('debug')('employee:employee');

const Dev = require('./dev.js');

const employeeSchema = mongoose.Schema({
  name : {type : String, required: true},
  timestamp : {type : Date, required: true},
  devs: [{type: mongoose.Schema.Types.ObjectId, ref:'dev'} ]
});

const Employee = module.exports = mongoose.model('employee', employeeSchema);

Employee.findByIdAndAddDev = function(id, dev){
  debug('findByIdAndAddDev');
  
  return Employee.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(employee => {
    dev.EID = employee._id;
    this.tempEmployee = employee;
    return new Dev(dev).save();
  })
  .then(dev => {
    this.tempEmployee.devs.push(dev._id);
    this.tempDev = dev;
    return this.tempEmployee.save();
  })
  .then( ()=> this.tempDev );
};