const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const globalModelHelpers = require('../utils/globalModelHelpers');

const adminSchema = new mongoose.Schema({
  name: String,
  role: String,
  username: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: [true, 'Admin with this Email already registered'],
    validate: [validator.isEmail, 'please enter a valid email'],
    required: [true, 'Email of admin is required']
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 25,
    required: [true, 'Password is required']
  },
  confirmPassword: {
    type: String,
    required: [true, 'confirm password is required'],
    validate: {
      validator: function(val) {
        return val === this.password;
      },
      message: 'Password does not match'
    }
  },
  photo: String,
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

adminSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 1);
  this.confirmPassword = undefined;
  next();
});

adminSchema.pre('save', function (next) {
  if(!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

adminSchema.method('verifyPassword', globalModelHelpers.verifyPassword);
adminSchema.method('passwordChangedAfter', globalModelHelpers.passwordChangedAfter);
adminSchema.method('createPasswordResetToken', globalModelHelpers.createPasswordResetToken);

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;