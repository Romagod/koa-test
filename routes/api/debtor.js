import Router from 'koa-router'
import DebtorController from "../../controllers/debtorController"

const router = new Router()
router.prefix('/api/v1/debtor')

const debtorController = new DebtorController()

router.get('/', async (ctx, next) => {
    await debtorController.getDebtors(ctx, next)
});

router.get('/in-progress', async (ctx, next) => {
    await debtorController.getPortfolioInProgress(ctx, next)
});

router.get('/efficiency', async (ctx, next) => {
    await debtorController.getEfficiency(ctx, next)
});

router.get('/efficiency-month', async (ctx, next) => {
    await debtorController.getEfficiencyInMonth(ctx, next)
});

router.get('/not-payed', async (ctx, next) => {
    await debtorController.getNotPayedDebtor(ctx, next)
});

export default router
