// importar mongoose
const mongoose = require('mongoose')
// configurar mongoose
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
const phoneRegex = /^\d{2,3}-\d+$/;


console.log('conecting to', url)

mongoose.connect(url)
.then(result => {
    console.log('connected to MongoDB')
})
.catch(error => {
    console.log('error connecting to MongoDB:', error.messge)
})

// defino el esquema
const contactSchema = new mongoose.Schema({
        name:{
            type: String,
            minLength: 3,
            required: true
        },
        number: {
         type: String, 
         minLength:8,
         required: true,
         validate: {
            validator: function(v) {
              return phoneRegex.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
        gmail: {
            type: String
        },
        birthday: {
            type: String
        }
        
   
})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)