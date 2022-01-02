const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      const user = await User.findOne({email}).exec();
      if (user) {
        const isPasswordCorrect = await user.checkPassword(password);
        if (isPasswordCorrect) {
          done(null, user);
        } else {
          done(null, false, 'Неверный пароль');
        }
      }

      done(null, false, 'Нет такого пользователя');
    },
);
