const db = require('../../config/db')

const Base = {
    init({ table }){
        if(!table) throw new Error('Invalid params')

        this.table = table

        return this
    },
    find(id){
        let query = ''
        if(this.table === 'students'){
            query = `SELECT students.*, teachers.name AS teacher_name 
            FROM students 
            LEFT JOIN teachers ON (students.teacher_id = teachers.id)
            WHERE students.id = $1`
        } else{
            query = `SELECT * FROM ${this.table} WHERE id = $1`
        }


        return db.query(query, [id])
    },
    async create(fields){
        try{
            let keys = [],
                values = []
            
            Object.keys(fields).map( key => {
                keys.push(key)
                values.push(`'${fields[key]}'`)
            })

            const query = `INSERT INTO ${this.table} (${keys.join(',')})
                VALUES (${values.join(',')})
                RETURNING id`

            const results = await db.query(query)
            // return results.rows[0].id
            return results

        } catch(err){
            console.error(err)
        }
    },    
    update(id, fields){

        try {
            let update = []

            Object.keys(fields).map( key => {
                const line = `${key} = '${fields[key]}'`
                update.push(line)
            })
            
            let query = `UPDATE ${this.table} SET
                ${update.join(',')} WHERE id = ${id}    
            `
            return db.query(query)
            
        } catch (error){
            console.error(error)
        }    
    },
    delete(id){
        return db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id])
    },
}

module.exports = Base