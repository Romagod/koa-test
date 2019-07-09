import db from "../database/db"

class DebtorController {
     async getDebtors(ctx, next){

         try {
             let rows = await db.query(
                 'SELECT "t1"."full_name", "t1"."d_sum" - (CASE WHEN "t1"."p_sum" ISNULL THEN 0 ELSE "t1"."p_sum" END) as debt_sum ' +
                     'FROM (SELECT MAX(person.full_name) AS full_name, SUM(payment.payment_sum) AS p_sum, ' +
                     'SUM(debt.debt_sum) AS d_sum ' +
                     'FROM debt ' +
                     'LEFT JOIN person ON (debt.person_id = person.id) ' +
                     'LEFT JOIN payment ON (debt.id = payment.debt_id) ' +
                     'GROUP BY debt.person_id) as t1 ' +
                 'WHERE ("t1"."d_sum" - (CASE WHEN "t1"."p_sum" ISNULL THEN 0 ELSE "t1"."p_sum" END) > 150)'
             )
             ctx.body = {
                 success: true,
                 message: 'All debtors',
                 result: rows.rows
             }
         }
         catch (e) {
             console.log('error: ', e)
             ctx.body = {
                 success: false,
                 message: '500',
                 result: {
                     errorCode: 500,
                     message: 'Server error'
                 }
             }
         }
    }

     async getPortfolioInProgress(ctx, next){

         try {
             let rows = await db.query('SELECT c.cal_date, d.debt_sum ' +
                 'FROM portfolio p ' +
                 '            LEFT JOIN debt d on p.id = d.portfolio_id ' +
                 '            LEFT JOIN calendar c on c.cal_date >= (cast(date_trunc(\'month\', p.sign_date) as date)) ' +
                 'WHERE d.id NOTNULL ' +
                 'ORDER BY c.cal_date')
             ctx.body = {
                 success: true,
                 message: 'Portfolio In Progress',
                 result: rows.rows
             }
         }
         catch (e) {
             console.log('error: ', e)
             ctx.body = {
                 success: false,
                 message: '500',
                 result: {
                     errorCode: 500,
                     message: 'Server error'
                 }
             }
         }
    }

     async getEfficiency(ctx, next){

         try {
             let rows = await db.query('SELECT p2.name, ( ' +
                 'CASE ' +
                    'WHEN SUM(p.payment_sum) ISNULL ' +
                        'THEN 0 ' +
                    'ELSE ((SUM(p.payment_sum)::FLOAT / SUM(debt.debt_sum)) * 100) ' +
                 'END ' +
                ') as efficiency ' +
             'FROM debt ' +
                'LEFT JOIN payment p on debt.id = p.debt_id ' +
                'left join portfolio p2 on debt.portfolio_id = p2.id ' +
             'group by p2.name ')
             ctx.body = {
                 success: true,
                 message: 'Efficiency',
                 result: rows.rows
             }
         }
         catch (e) {
             console.log('error: ', e)
             ctx.body = {
                 success: false,
                 message: '500',
                 result: {
                     errorCode: 500,
                     message: 'Server error'
                 }
             }
         }
    }

     async getEfficiencyInMonth(ctx, next){

         try {
             let rows = await db.query('SELECT t1.date2, CASE WHEN SUM(p.payment_sum) ISNULL THEN 0 ELSE (SUM(p.payment_sum)::FLOAT / t1.sum) * 100 END as res\n' +
                 'FROM (SELECT c.cal_date as date2, SUM(d.debt_sum) as sum\n' +
                 '      FROM portfolio p\n' +
                 '             LEFT JOIN debt d on p.id = d.portfolio_id\n' +
                 '             LEFT JOIN calendar c on c.cal_date >= (cast(date_trunc(\'month\', p.sign_date) as date))\n' +
                 '      WHERE d.id NOTNULL\n' +
                 '      group by c.cal_date\n' +
                 '      ORDER BY c.cal_date) as t1\n' +
                 'LEFT JOIN payment p ON cast(t1.date2 as date) = cast(date_trunc(\'month\', p.date) as date)\n' +
                 'group by t1.date2, t1.sum')
             ctx.body = {
                 success: true,
                 message: 'Efficiency',
                 result: rows.rows
             }
         }
         catch (e) {
             console.log('error: ', e)
             ctx.body = {
                 success: false,
                 message: '500',
                 result: {
                     errorCode: 500,
                     message: 'Server error'
                 }
             }
         }
    }

     async getNotPayedDebtor(ctx, next){

         try {
             let rows = await db.query('SELECT d.id, d.debt_sum\n' +
                 'FROM debt d\n' +
                 '       LEFT JOIN payment p on d.id = p.debt_id\n' +
                 'WHERE p.payment_sum ISNULL')
             ctx.body = {
                 success: true,
                 message: 'Not payed',
                 result: rows.rows
             }
         }
         catch (e) {
             console.log('error: ', e)
             ctx.body = {
                 success: false,
                 message: '500',
                 result: {
                     errorCode: 500,
                     message: 'Server error'
                 }
             }
         }
    }


}

export default DebtorController
