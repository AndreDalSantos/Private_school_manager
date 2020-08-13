module.exports = {
    age(timestamp){
        const today = new Date()
        const birthDate = new Date(timestamp)
    
        // retorna 2020 - 1984 = 36
        let age = today.getUTCFullYear() - birthDate.getUTCFullYear()
        const month = today.getUTCMonth() - birthDate.getUTCMonth()
    
        today.getUTCDate()
        birthDate.getUTCDate()
    
        if (month < 0 || month == 0 && today.getUTCDate() < birthDate.getUTCDate()){
            age = age - 1
        }
    
        return age
    
    },
    date(timestamp) {
        const date = new Date(timestamp)

        const year = date.getUTCFullYear()
        const month = `0${date.getUTCMonth() + 1}`.slice(-2)
        const day = `0${date.getUTCDate()}`.slice(-2)

        return {
            day,
            month,
            year,
            birthDate: `${day}/${month}`,
            iso: `${year}-${month}-${day}`,
            format: `${day}/${month}/${year}`
        }
    },
    graduation(education_level){
        if(education_level == 'graduate')
            return 'Superior Completo'
        if(education_level == 'master')
            return 'Mestre(a)'
        if(education_level == 'phd')
            return 'Doutor(a)'
        if(education_level == 'high_school')
            return 'Ensino médio'
    },
    grade(level){
        if(level == '5ef') return '5º ano Ensino Fundamental'
        if(level == '6ef') return '6º ano Ensino Fundamental'
        if(level == '7ef') return '7º ano Ensino Fundamental'
        if(level == '8ef') return '8º ano Ensino Fundamental'
        if(level == '1em') return '1º ano Ensino Médio'
        if(level == '2em') return '2º ano Ensino Médio'
        if(level == '3em') return '3º ano Ensino Médio'
    },
    grade2(level){
        if(level == '5ef') return '5º EF'
        if(level == '6ef') return '6º EF'
        if(level == '7ef') return '7º EF'
        if(level == '8ef') return '8º EF'
        if(level == '1em') return '1º EM'
        if(level == '2em') return '2º EM'
        if(level == '3em') return '3º EM'
    }
}