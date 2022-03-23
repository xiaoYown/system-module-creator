import pkg from './pkg';

const Router = require('koa-router');

const router = new Router({ prefix: '/api' });

router.use('/pkg', pkg.routes(), pkg.allowedMethods());

export default router;
