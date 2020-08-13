const { age, grade, date, grade2 } = require('../../lib/utils')
const Intl = require('intl')
const Student = require('../models/Student')
const Teacher = require('../models/Teacher')

module.exports = {
    async index(req, res) {
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

        let students = (await Student.paginate(params)).rows

        for( let i = 0; i < students.length; i++ ) {
            students[i].grade = grade2(students[i].grade)
        }

        if(students[0]){
            const pagination = {
                total: Math.ceil(students[0].total / limit),
                page
            }
            return res.render('students/index', { students, pagination, filter })
        } else {
            return res.render('students/not_found')
        }
    },
    async create(req, res) {
        const teachers = (await Teacher.teacherSelectOptions()).rows
        return res.render('students/create', { teacherOptions: teachers })
        
    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        for( key of keys ) {
            if( req.body[key] == '')
            return res.render('students/create', { error: "Por favor preencha todos os campos!"})
        }

        const {
            avatar_url,
            name,
            birth,
            email,
            grade,
            workload,
            teacher
        } = req.body

        const studentId = (await Student.create({
            avatar_url,
            name,
            birth: date(birth).iso,
            email,
            grade,
            workload,
            teacher_id: teacher
        })).rows[0].id

        return res.render(`students/post_put_success`)
    },
    async show(req, res) {
        let student = (await Student.find(req.params.id)).rows[0]
        
        if (!student) return res.send('Student not found')

        student = {
            ...student,
            age: age(student.birth),
            grade: grade(student.grade)
        }
        
        return res.render('students/show', { student })

    },
    async edit(req, res) {
        
        let student = (await Student.find(req.params.id)).rows[0]        
        
        if (!student) return res.send('Student not found')
        
        student.birth = date(student.birth).iso

        const teachers = (await Teacher.teacherSelectOptions()).rows

        return res.render('students/edit', { student, teacherOptions: teachers })

    },
    async put(req, res) {
        const keys = Object.keys(req.body)

        for( key of keys ) {
            if( req.body[key] == '')
                return res.send('Please fill all fields')
        }

        const {
            avatar_url,
            name,
            birth,
            email,
            grade,
            workload,
            teacher
        } = req.body

        const student = {
            avatar_url,
            name,
            birth,
            email,
            grade,
            workload,
            teacher_id: teacher 
        }

        await Student.update(req.body.id, student)
        
        return res.render(`students/post_put_success`)
    },
    async delete(req, res) {
        await Student.delete(req.body.id)
        return res.render('students/delete_success')
    },
}