import db from "../database/db"

class PersonController {
     async getPersons(ctx, next){
         try {
             let data = await db.query('SELECT * FROM person')
             ctx.body = {
                 success: true,
                 message: 'All persons',
                 result: data.rows
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

     async getPerson(ctx, next){
         const {id} = ctx.params
         if (!this.isInteger(Number(id))) {
             ctx.body = {
                 success: false,
                 message: '500',
                 result: {
                     errorCode: 500,
                     message: 'Server error'
                 }
             }
             return
         }

         try {
             let rows = await db.query('SELECT * FROM person WHERE id = $1', [id])
             ctx.body = {
                 success: true,
                 message: 'All persons',
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

     async setPersonName(ctx, next){
         const {id} = ctx.params
         const {full_name} = ctx.request.body
         if (!this.isInteger(Number(id))) {
             ctx.body = {
                 success: false,
                 message: '500',
                 result: {
                     errorCode: 500,
                     message: 'Server error'
                 }
             }
             return
         }

         try {
             let rows = await db.query('UPDATE person SET full_name = $2 WHERE id = $1', [id, full_name])
             ctx.body = {
                 success: true,
                 message: 'All persons',
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

    isInteger(num) {
        return (num ^ 0) === num;
    }
}

export default PersonController
