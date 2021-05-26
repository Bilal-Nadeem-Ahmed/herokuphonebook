const mongoose = require('mongoose')
const uniqueValidator = require('mongo-unique-validator')

const password = process.argv[2]
const name= process.argv[3]
const number =process.argv[4]

const url =
  `mongodb+srv://user1:${password}@cluster0.yaoc2.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = mongoose.Schema({
  name: { type:String, required: true, unique:true},
  number: { type:String, required: true, unique:true},
  
})
personSchema.plugin(uniqueValidator)

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number,
  
})
if (process.argv.length < 4) {
    console.log('Phonebook:')
    Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person.name + ' ' + person.number)
    console.log(person.number)
  })
  // the right place to close the connection
  mongoose.connection.close()
})

  } else {
      person.save().then(result => {
  console.log(`added ${result.name} ${result.number}`)
  mongoose.connection.close()
})
  }
  

// person.save().then(result => {
//   console.log(`note posted, the result is ${result}`)
//   mongoose.connection.close()
// })
// Person.find({}).then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
//   mongoose.connection.close()
// })
