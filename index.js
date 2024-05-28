const express = require('express')
const app = express()

const cors = require('cors')

app.use(cors())

// importo morgan 
const morgan = require('morgan')

// configuro morgan formato'tiny'
app.use(morgan('tiny'))

app.use(express.json())
let persons = [
    {
        "id": 1, 
        "name": "julian",
        "number": "111111",
        "gmail": "",
        "birthday": ""
    },
    {
        "id": 2,
        "name": "Pedro",
        "number": "3144142323",
        "gmail": "",
        "birthday": "",
    }
]



app.get('/info', (request, response) => {
    const now = new Date();
    response.send(`<div>
    <h1>Phonebook has info for ${persons.length} people</h1>
    <br/>
    ${now}
    </div>`)
})
//GET ALL
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

//GET ONE
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
   

    const person = persons.find(person => person.id === id)
    

    if(person){
        response.json(person)
    } else {
        response.statusMessage = "Current id does not match"
        response.status(404).end()
    }
})

// Delete
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    persons = persons.filter(person => person.id !== id)
    console.log(persons)

    response.status(204).end()
})

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
// POST
app.post('/api/persons', (request, response) => {
    const body = request.body;
    const normalize = (text) => text.toUpperCase().trim().replace(/\s+/g, '');
console.log('lo que ahi en body es', body)
    if (!body.name || !body.number ) {
        return response.status(400).json({
            error: 'content missing (name and number required)'
        });
    }

    const nameRepeat = persons.find(person => normalize(person.name) === normalize(body.name))

    if(nameRepeat) {
        return response.status(400).json({
            error: 'name must be unique'
        });
    }

    
    const person = {
        name: body.name,
        number: body.number,
        gmail: body.gmail,
        birthday: body.birthday,
        id: getRandomInt(5000)
    
    };

    persons = persons.concat(person);

    response.json(person);
});

// MIDLEWARE
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)


  const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)



















// ¿QUE ES MORGAN?
// registra información sobre las solicitudes que llegan a el servidor(metodo HTTP, url, estado de respuesta, tiempo de respuesta)

// ¿QUE HACE MORGAN?
// intercepta cada solicitud HTTP (POST, PUT, DELETE, ETC) y registra datos sobre la solcitud, en este ejecicio estoy usando el formato 'tiny' de morgan, los datos que se registran los imprime en consola