'use strict'

import Koa from 'koa'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
import error from 'koa-json-error'

import routes, {routesList} from './routes'

const app = new Koa()
app.use(logger())

app.use(async (ctx, next) => {
    try {
        await next()
        logger.info(
            ctx.method + ' ' + ctx.url + ' RESPONSE: ' + ctx.response.status
        )
    } catch (error) {}
})

//Apply error json handling
let errorOptions = {
    postFormat: (e, obj) => {
        //Here's where we'll stick our error logger.
        logger.info(obj)
        if (process.env.NODE_ENV !== 'production') {
            return obj
        } else {
            delete obj.stack
            delete obj.name
            return obj
        }
    },
}
app.use(error(errorOptions))

// return response time in X-Response-Time header
app.use(async function responseTime(ctx, next) {
    const t1 = Date.now()
    await next()
    const t2 = Date.now()
    ctx.set('X-Response-Time', Math.ceil(t2 - t1) + 'ms')
})

app.use(bodyParser({ enableTypes: ['json'] }))

app.use(routes())
app.routesList = routesList

app.listen(3108, 'koa-test.loldev.ru', () => console.log('Start server...'))

export default app
