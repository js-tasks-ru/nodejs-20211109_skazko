const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscribers = [];

class Subscriber {
  constructor() {
    this.messagePromise = new Promise((resolve) => {
      this.sendMessage = resolve;
    });
  }
}

router.get('/subscribe', async (ctx, next) => {
  const subscriber = new Subscriber();
  subscribers.push(subscriber);
  const message = await subscriber.messagePromise;
  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const {message} = ctx.request.body;
  if (message) {
    subscribers.forEach((subscriber) => subscriber.sendMessage(message));
    subscribers = [];
  }
  ctx.body = 'ok';
});

app.use(router.routes());

module.exports = app;
