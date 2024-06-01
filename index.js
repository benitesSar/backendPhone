require('dotenv').config();
const express = require('express')
const cors = require('cors')
const Contact = require('./models/contact')
const app = express()


app.use(cors())
// app.use(express.static('dist'))
app.use(express.json())
// importo morgan - configuro en formato 'tiny' 
const morgan = require('morgan')
app.use(morgan('tiny'))
app.use(express.static('dist'))




// OBTENER NUMERO DE CONTACTOS - MONGO - countDocuments
app.get('/info', (request, response) => {
    Contact.countDocuments({})
    .then(count => {
        const now = new Date();
        response.send(`<div>
        <h1>Phonebook has info for ${count} people</h1>
        <br/>
        ${now}
        </div>`)
    })
    .catch(error => next(error))
    
    
})

//GET ALL - MONGO
app.get('/api/persons', (request, response) => {
   Contact.find({}).then(contacts => {
    response.json(contacts)
   })
})

//GET ONE - MONGO
app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id)
  .then(contact => {
    if(contact) {
        response.json(contact)
    } else {
        response.status(404).end()
    }
  })
  .catch(error => next(error))
})

// DELETE - MONGO
app.delete('/api/persons/:id', (request, response, next) => {
    Contact.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
 
})

// UPDATE - MONGO - findByIdAndUpdate
app.put('/api/persons/:id', (request, response, next) => {
    const { name, number, gmail, birthday } = request.body


    Contact.findByIdAndUpdate(
        request.params.id, 
        { name, number, gmail, birthday }, 
        { new: true, runValidators: true, context: 'query' }
    )
    
    .then(updateContact => {
        response.json(updateContact)
    })
    .catch(error => next(error))
})



// POST - MONGO
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const contact = new Contact({
        name: body.name,
        number: body.number,
        gmail: body.gmail,
        birthday: body.birthday,
    })

    contact.save()
    .then(savedContact => {
        response.json(savedContact)
    })
    .catch(error => next(error))
});

// MIDLEWARE PARA RUTAS DESCONOCIDAS
const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
  }
  
  app.use(unknownEndpoint)

// MIDLEWARE PARA MANEJO DE ERRORES
const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malfortted id'})
    } else if(error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }
    next(error)
}

app.use(errorHandler)


  const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)



















// ¿QUE ES MORGAN?
// registra información sobre las solicitudes que llegan a el servidor(metodo HTTP, url, estado de respuesta, tiempo de respuesta)

// ¿QUE HACE MORGAN?
// intercepta cada solicitud HTTP (POST, PUT, DELETE, ETC) y registra datos sobre la solcitud, en este ejecicio estoy usando el formato 'tiny' de morgan, los datos que se registran los imprime en consola