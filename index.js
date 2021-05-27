/* eslint-disable no-unused-vars */

require('dotenv').config()
const { request, response } = require('express')
const express= require('express')
const app = express()
app.use(express.static('build'))
app.use(express.json())
const morgan=require('morgan')
const Person=require('./models/person')

morgan.token('data',(request,response) => JSON.stringify(request.body))

app.use(morgan(':method :url :status :response-time ms  :data'))
// cors
const cors = require('cors')

app.use(cors())



app.get('/api/persons',(request,response) => {
  Person.find({}).then(person => {
    response.json(person)

  }).catch(err => console.log(err))
})

app.get('/info',(request,response) => {

  response.send(`<p> Phonebook has info for ${Person.length} people</p>
    <p>${new Date()}</p>`)
})
app.get('/api/persons/:id',(request,response,next) => {

  Person.findById(request.params.id)
    .then(person => {
      if(person){
        response.json(person)
      } else {
        response.status(404).end()
      }

    })
    .catch(error => {
      next(error)
    })
})
app.delete('/api/persons/:id',(request,response, next) => {

  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    }).catch(error => next(error))

})



app.post('/api/persons',(request,response,next) => {

  const body = request.body

  if(body.name === undefined){
    return response.status(400).json({ error:'name missing' })
  }
  const person = new Person ({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => {
    if(error.name==='ValidationError'){
      return response.status(400).json({ error: 'name or number too short' })
    }else {
      console.log(error)
    }

  })


})
app.put('/api/persons/:id',(request,response,next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id,person,{ new:true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})
// error handling middleware for next
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)


const PORT=process.env.PORT
app.listen(PORT,() => {
  console.log(`server is running on port ${PORT}`)
})