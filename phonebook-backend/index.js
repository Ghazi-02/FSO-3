const express = require('express')
const app = express()
app.use(express.json())
var morgan = require('morgan')
app.use(morgan('tiny'))

const cors = require('cors')
app.use(cors())

app.use(express.static('build'))
require('dotenv').config()
const Person = require('./models/person')


app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.json(person)
    })
   
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})
app.get('/info', (request, response) => {
    let info = `Phonebook has info for ${persons.length} people`
    let date = new Date().toString()

    response.end(`${info}\n${date}`)
})

app.delete("/api/persons/:id", (request, response) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})



app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({
            error: "name or number missing"
        })
    // } else if ((person.map(person => person.name).includes(body.name)) === true) {
    //     return response.status(400).json({
    //         error: "name must be unique"
    //     })
    } 
        const person = new Person ({
            name: body.name,
            number: body.number,
            date: new Date()
        })
      
        person.save().then(savedPerson => {
            response.json(savedPerson)
        })

    })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})