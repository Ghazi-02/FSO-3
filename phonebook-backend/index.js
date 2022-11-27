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
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(person => person.id))
        : 0
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "name or number missing"
        })
    } else if ((persons.map(person => person.name).includes(body.name)) === true) {
        return response.status(400).json({
            error: "name must be unique"
        })
    } else {
        const person = {
            id: generateId(),
            name: body.name,
            number: body.number
        }
        persons = persons.concat(person)
        response.json(person)

    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})