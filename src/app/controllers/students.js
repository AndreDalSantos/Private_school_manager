const { age, grade, date } = require('../../lib/utils')
const Intl = require('intl')
const Student = require('../models/Student')

module.exports = {
    index(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 2
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(students){
                if(students[0]){
                    const pagination = {
                        total: Math.ceil(students[0].total / limit),
                        page
                    }
                    return res.render('students/index', { students, pagination, filter })
                } else {
                    return res.render('students/not_found')
                }
                
            }
        }

        Student.paginate(params) 
    },
    create(req, res) {
        Student.teacherSelectOptions(function(options){
            return res.render('students/create', { teacherOptions: options })
        })
    },
    post(req, res) {
        const keys = Object.keys(req.body)

        for( key of keys ) {
            if( req.body[key] == '')
                return res.send('Please fill all fields')
        }

        Student.create(req.body, function(student){
            return res.redirect(`/students/${student.id}`)
        })
    },
    show(req, res) {
        Student.find(req.params.id, function(student){
            if (!student) return res.send('Student not found')

            student.age = age(student.birth)
            student.grade = grade(student.grade)

            return res.render('students/show', { student })
        })
    },
    edit(req, res) {
        Student.find(req.params.id, function(student){
            if (!student) return res.send('Student not found')

            student.birth = date(student.birth).iso
            
            Student.teacherSelectOptions(function(options){
                return res.render('students/edit', { student, teacherOptions: options })
            })    
        })
    },
    put(req, res) {
        const keys = Object.keys(req.body)

        for( key of keys ) {
            if( req.body[key] == '')
                return res.send('Please fill all fields')
        }

        Student.update(req.body, function(){
            return res.redirect(`students/${req.body.id}`)
        })
    },
    delete(req, res) {
        Student.delete(req.body.id, function(){
            return res.redirect('/students')
        })
    },
}