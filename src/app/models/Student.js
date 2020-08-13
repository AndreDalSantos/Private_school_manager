const { date, grade, grade2 } = require('../../lib/utils')
const db = require('../../config/db')
const Base = require('./Base')

Base.init({ table: 'students' })

module.exports = {
    ...Base,  
    paginate(params){
        
        const { filter, limit, offset } = params

        let query = '',
            filterQuery = '',
            totalQuery = `(
                SELECT count(*) FROM students
            ) AS total`

        if(filter){

            filterQuery = `
            WHERE students.name ILIKE '%${filter}%'
            OR students.email ILIKE '%${filter}%'
            `

            totalQuery = `(
                SELECT count(*) FROM students
                ${filterQuery}
            ) AS total`
        }

        query = `
            SELECT students.*, ${totalQuery} 
            FROM students
            ${filterQuery}
            LIMIT $1 OFFSET $2
        `

        return db.query(query, [limit, offset])
    }
}