const Message = require('../models/Message');
const mapMessage = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {
  const messages = (await Message.find(
      {chat: ctx.user.id},
      null,
      {limit: 20, sort: {date: -1}},
  )).map(mapMessage);

  ctx.body = {messages};
};
