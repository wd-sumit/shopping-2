// const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const globalModelHelpers = require('../utils/globalModelHelpers');

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A vendor must have a name']
  },
  role: {
    type: String,
    default: 'vendor'
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'A vendor must have a email'],
    validate: [validator.isEmail, 'Please enter a valid Email']
  },
  phone: {
    type: Number,
    min: 10,
    max: 10
  },
  password: {
    type: String,
    required: [true, 'A vendor must have a password'],
    minlength: 8,
    maxlength: 25
  },
  confirmPassword: {
    type: String,
    required: [true, 'A vendor must have a password'],
    validate: {
      validator: function(val) {
        return val === this.password;
      },
      message: 'Passwords does not match'
    }
  },
  shop: {
    name: String,
    address: String,
    phoneNo: Number,
    location: [] // Location coordinates
  },
  isVerified: {
    type: Boolean,
    default: false 
  },
  photo: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
},{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

vendorSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 1);
  this.confirmPassword = undefined;
  next();
});

vendorSchema.pre('save', function(next) {
  if(!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

vendorSchema.method('verifyPassword', globalModelHelpers.verifyPassword);
vendorSchema.method('passwordChangedAfter', globalModelHelpers.passwordChangedAfter);
vendorSchema.method('createPasswordResetToken', globalModelHelpers.createPasswordResetToken);

const Vendor = mongoose.model('Vendor', vendorSchema);
module.exports = Vendor;