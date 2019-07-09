import combineRouters from 'koa-combine-routers'
import api from './api'

// export default statics
const routes = [
    ...api
]

export default combineRouters(
    routes
)
let rList = []

routes.map(route => {
    return route.stack.map(r => {
        return rList.push(r)
    })
})
export const routesList = rList
