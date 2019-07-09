import Router from 'koa-router'
import PersonController from "../../controllers/personController"

const router = new Router()
router.prefix('/api/v1/person')

const personController = new PersonController()

router.get('/', async (ctx, next) => {
    await personController.getPersons(ctx, next)
});
router.get('/:id', async (ctx, next) => {
    await personController.getPerson(ctx, next)
});
router.post('/:id', async (ctx, next) => {
    await personController.setPersonName(ctx, next)
});

export default router
