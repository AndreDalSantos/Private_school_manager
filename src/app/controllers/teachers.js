const { age, date, graduation } = require('../../lib/utils')
const Intl = require('intl')
const Teacher = require('../models/Teacher')

module.exports = {
    async index(req, res) {
        try {
            let { filter, page, limit } = req.query

            page = page || 1
            limit = limit || 2
            let offset = limit * (page - 1)

            const params = {
                filter,
                page,
                limit,
                offset                
            }

            const teachers = (await Teacher.paginate(params)).rows

            if(teachers[0]){
                const pagination = {
                    total: Math.ceil(teachers[0].total / limit),
                    page
                }
                return res.render('teachers/index', { teachers, pagination, filter })
            } else {
                return res.render('teachers/not_found')
            }

        } catch (error) {
            console.error(error)
        }            
        
    },
    create(req, res) {
        return res.render('teachers/create')
    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        for( key of keys ) {
            if( req.body[key] == '')
                return res.render('teachers/create', { error: "Por favor preencha todos os campos!"})
        }

        let {
            avatar_url,
            name,
            birth_date,
            education_level,
            class_type,
            subjects_taught,
            created_at
        } = req.body 
        
        let teacher = {
            avatar_url,
            name,
            birth_date: date(birth_date).iso,
            education_level,
            class_type,
            subjects_taught,
            created_at: date(Date.now()).iso
        }

        const teacherId = (await Teacher.create(teacher)).rows[0].id

        return res.render(`teachers/post_put_success`)

    },
    async show(req, res) {

        let teacher = (await Teacher.find(req.params.id)).rows[0]

        
        if (!teacher) return res.send('Teacher not found')
        
        teacher = {
            ...teacher,
            age: age(teacher.birth_date),
            subjects_taught: teacher.subjects_taught.split(','),
            education_level: graduation(teacher.education_level),
            created_at: date(teacher.created_at).format
        }

        return res.render('teachers/show', { teacher })
        
    },
    async edit(req, res) {
        
        let teacher = (await Teacher.find(req.params.id)).rows[0]
        
        if (!teacher) return res.send('Teacher not found')
        
        teacher = {
            ...teacher,
            birth_date: date(teacher.birth_date).iso
        }
        
        return res.render('teachers/edit', { teacher })
    },
    async put(req, res) {
        const keys = Object.keys(req.body)

        for( key of keys ) {
            if( req.body[key] == '')
                return res.send('Please fill all fields')
        }

        await Teacher.update(req.body.id, req.body)

        return res.render(`teachers/post_put_success`)

    },
    async delete(req, res) {
        await Teacher.delete(req.body.id)   
        return res.render(`teachers/delete_success`)
    },
}