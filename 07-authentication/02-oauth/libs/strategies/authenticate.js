const User = require('../../models/User');
module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    done(null, null, 'Не указан email');
  }
  const user = await User.findOne({email}).exec();
  if (user) {
    done(null, user);
  } else {
    try {
      const newUser = await User.create({
        email, displayName,
      });
      done(null, newUser);
    } catch (e) {
      done(e);
    }
  }
};
