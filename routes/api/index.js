import Router from 'koa-router'
import person from './person'
import debtor from './debtor'
const router = new Router();

router.get('/', (ctx, next) => {
    ctx.body = 'Empty page';
});

export default
[
    router,
    person,
    debtor,
]
