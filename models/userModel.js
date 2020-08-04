const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const globalModelHelpers = require('../utils/globalModelHelpers');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name cannot be empty']
  },
  role: {
    type: String,
    default: 'user'
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'email cannot be empty'],
    validate: [validator.isEmail, 'please provide a valid email']
  },
  username: {
    type: String,
    required: [true, 'username is required'],
    unique: true,
    maxlength: 20,
    minlength: 5
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: 8,
    maxlength: 20,
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, 'confrimPassword is required'],
    validate: {
      validator: function(val) {
        return val === this.password;
      },
      message: 'Passwords does not match'
    }
  },
  photo: {
    type: String
  },
  cartItems: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Cart'
    }
  ],
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
});

userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 1);
  this.confirmPassword = undefined;
  next();
});

userSchema.pre('save', function(next) {
  if(!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function(next) {
  this.find({active: {$ne: false}}).select('-__v');
  next();
});

userSchema.method('verifyPassword', globalModelHelpers.verifyPassword);
userSchema.method('passwordChangedAfter', globalModelHelpers.passwordChangedAfter);
userSchema.method('createPasswordResetToken', globalModelHelpers.createPasswordResetToken);

const User = mongoose.model('User', userSchema);

module.exports = User;