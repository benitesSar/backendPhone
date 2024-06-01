// importar mongoose
const mongoose =  require('mongoose')

if(process.argv.length<3){
console.log('give password as argument')
process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://backendp:${password}@cluster0.qgjpa3f.mongodb.net/contactsApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

mongoose.connect(url)

// defino el esquema
const contactSchema = new mongoose.Schema({
    name: String,
    number: Number,
    gmail: String,
    birthday: String
})

// defino el modelo, es una funcion constructora
const Contact = mongoose.model('Contact', contactSchema)

// creo un objeto con ayuda del modulo Contact
const contact = new Contact({
    name: 'Julie',
    number: '30000000',
    gmail: 'juli@gmail.com',
    birthday: '10/11/2000'
})

// // guardo la nota en la base de datos con el metodo save
// contact.save().then(result => {
//     console.log(`added ${result.name} number ${result.number} to phonebook`)
//     mongoose.connection.close()
// })

// obtener las notas 
Contact.find({}).then(result => {
    console.log('contacts:')
    result.forEach(contact => {
      console.log(`${contact.name} ${contact.number}`)
    })
    mongoose.connection.close()
  })