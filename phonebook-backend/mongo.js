const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password: node mongo.js <password> ')

  process.exit(1)
}


const password = process.argv[2]
const name = process.argv[3]
const phoneNumber = process.argv[4]


const url = `mongodb+srv://auhmirza:${password}@cluster0.n83z3bp.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,

})

const Person = mongoose.model('Person', personSchema)


if(process.argv.length === 3){
  mongoose
    .connect(url)
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}else {mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')

    const person = new Person({
      name: name,
      number: phoneNumber,
    })
    return person.save()

  })

  .then(() => {
    console.log(`Added ${name} number ${phoneNumber} to the phonebook`)
    return mongoose.connection.close()
  })
  .catch((err) => console.log(err))


}