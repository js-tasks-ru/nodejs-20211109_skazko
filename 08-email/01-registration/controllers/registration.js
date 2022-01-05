const {v4: uuid} = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const {displayName, email, password} = ctx.request.body;
  const verificationToken = uuid();
  try {
    const newUser = await User.create({
      displayName, email, verificationToken,
    });
    await newUser.setPassword(password);
    await newUser.save();
    await sendMail({
      template: 'confirmation',
      locals: {token: verificationToken},
      to: email,
      subject: 'Подтвердите почту',
    });
    ctx.status = 200;
    ctx.body = {status: 'ok'};
  } catch (e) {
    throw e;
  }
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  const user = await User.findOne({verificationToken});
  if (!user) {
    ctx.status = 400;
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
    return;
  }

  user.verificationToken = undefined;
  await user.save();
  const token = await ctx.login(user);
  ctx.body = {token};
};
