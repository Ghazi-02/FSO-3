require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const cors = require('cors')
const morgan = require('morgan')


app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(morgan('tiny'))



app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.json(person)
    })

})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
        if (person) {
          response.json(person)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
  })
 
 
app.get('/info', (request, response) => {
    Person.find({}).then(person => {
      response.send(`
              <p>Phonebook has info for ${person.length} people<p>
              <p>${new Date()}
          `)
    })
  
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
    const person = new Person({
        name: body.name,
        number: body.number,
        date: new Date()
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })

})




const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})