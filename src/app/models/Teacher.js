const { date } = require('../../lib/utils')
const db = require('../../config/db')
const Base = require('./Base')

Base.init({ table: 'teachers' })

module.exports = {
    ...Base,
    findBy(filter, callback){
        db.query(`
            SELECT teachers.*, count(students) AS total_students
            FROM teachers
            LEFT JOIN students ON (students.teacher_id = teachers.id)
            WHERE teachers.name ILIKE '%${filter}%'
            OR teachers.subjects_taught ILIKE '%${filter}%'
            GROUP BY teachers.id
            ORDER BY total_students DESC 
        `, function(err, results){
            if(err) throw `Database error ${err}`

            callback(results.rows)
        })
    },
    paginate(params){
        
        const { filter, limit, offset } = params

        let query = '',
            filterQuery = '',
            totalQuery = `(
                SELECT count(*) FROM teachers
            ) AS total`

        if(filter){

            filterQuery = `
            WHERE teachers.name ILIKE '%${filter}%'
            OR teachers.subjects_taught ILIKE '%${filter}%'
            `

            totalQuery = `(
                SELECT count(*) FROM teachers
                ${filterQuery}
            ) AS total`
        } 

        query = `
            SELECT teachers.*, ${totalQuery}, count(students) AS total_students 
            FROM teachers
            LEFT JOIN students ON (teachers.id = students.teacher_id)
            ${filterQuery}
            GROUP BY teachers.id            
            ORDER BY total_students DESC
            LIMIT $1 OFFSET $2
        `

        return db.query(query, [limit, offset])
    },
    teacherSelectOptions(){
        return db.query(`SELECT name, id FROM teachers`)  
      },
}