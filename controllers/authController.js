const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createCookieToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN + 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOption.secure = true;
  res.cookie('jwt', token, cookieOption);
  user.password = undefined;
  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};

exports.allowedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(new AppError('User is not allowed to perform this action', 403));
    }
    next();
  };
};

exports.signup = (Model) =>
  catchAsync(async (req, res, next) => {
    const newUser = await Model.create(req.body);
    createCookieToken(newUser, 200, res);
  });

exports.login = (Model) =>
  catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
      return next(new AppError('Please provide both email and password', 400));
    const user = await Model.findOne({
      $or: [{ email: email }, { username: email }],
    }).select('+password');
    if (!user || !(await user.verifyPassword(password, user.password))) {
      return next(new AppError('Invalid Username or password'));
    }
    if (!user.active) {
      user.active = true;
      await user.save({ validateBeforeSave: false });
    }
    createCookieToken(user, 200, res);
  });

exports.logout = catchAsync(async (req, res, next) => {
  const cookieOption = {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  };
  res.cookie('jwt', 'logout', cookieOption);
  res.status(200).json({
    status: 'success',
    isSuccess: true,
    message: 'You have been successfully logged Out',
  });
});

exports.protect = (Model) =>
  catchAsync(async (req, res, next) => {
    // check if there is a token
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return next(new AppError('Please login before using this app', 401));
    }
    // check if the provided token is valid or not
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET_KEY
    );
    const currentUser = await Model.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('User with this token does not exist', 401));
    }
    if (currentUser.passwordChangedAfter(decoded.iat)) {
      return next(
        new AppError('Password has been changed, please login again', 401)
      );
    }
    req.user = currentUser;
    next();
  });

exports.forgotPassword = (Model, type) =>
  catchAsync(async (req, res, next) => {
    // Get user based on email or username
    const user = await Model.findOne({
      $or: [{ email: req.body.email }, { username: req.body.email }],
    });
    if (!user)
      return next(
        new AppError('Account with this email or username not found', 401)
      );
    // Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/${type}/forgotpassword?token=${resetToken}`;
    const message = `Forgot your password! Click the link to update your password - ${resetUrl}`;
    // send mail
    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset link',
        message,
      });
      res.status(200).json({
        success: true,
        message:
          'A password reset link has been sent to your mail. The link will expire in 24 hours',
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new AppError('Error sending Email', 401));
    }
  });

exports.resetPassword = (Model) =>
  catchAsync(async (req, res, next) => {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    const user = await Model.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      return next(new AppError('Token is invalid or expired', 401));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    createCookieToken(user, 200, res);
  });

exports.updatePassword = (Model) =>
  catchAsync(async (req, res, next) => {
    const user = await Model.findById(req.user.id).select('+password');
    if (!(await user.verifyPassword(req.body.currentPassword, user.password))) {
      return next(
        new AppError('Password invalid! please enter correct password', 401)
      );
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();
    createCookieToken(user, 200, res);
  });

exports.deactivateMe = (Model) =>
  catchAsync(async (req, res, next) => {
    const user = await Model.findByIdAndUpdate(req.user.id, {
      active: false,
    }).select('+active');
    res.status(200).json({
      success: true,
      message:
        'Account has been successfully deactivated! You can activate your account by logging in again',
      data: user,
    });
  });
