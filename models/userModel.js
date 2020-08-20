const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: 'user',
  },
  phone: {
    type: Number,
    validate: {
      validator: function (val) {
        return val.toString().length === 10;
      },
      message: 'Please enter a valid Phone Number',
    },
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'email cannot be empty'],
    validate: [validator.isEmail, 'please provide a valid email'],
  },
  username: {
    type: String,
    required: [true, 'username is required'],
    unique: true,
    maxlength: 20,
    minlength: 5,
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: 8,
    maxlength: 20,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'confrimPassword is required'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords does not match',
    },
  },
  address: String,
  shop: {
    name: String,
    address: String,
    phoneNo: Number,
    location: [], // Location coordinates
  },
  photo: {
    type: String,
  },
  cartItems: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Cart',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 1);
  this.confirmPassword = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.verifyPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChangedAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 48 * 60 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
