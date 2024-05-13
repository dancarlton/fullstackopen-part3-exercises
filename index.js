const { error } = require( 'console' )
const express = require('express')
const app = express()

app.use(express.json())

// middleware
const morgan = require('morgan')

morgan.token('body', (require) => {
  if (require.method === 'POST') {
    return JSON.stringify(require.body)
  }
  return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));



let persons = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Its going to be ok, just keep grinding!</h1>')
})


// persons API calls
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if(person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);

  persons = persons.filter(person => person.id !== id);
  response.status(204).end(); // No content to send back
});


const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

// add a person
app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    });
  }

  const exists = persons.some(person => person.name === body.name)
  if(exists){
    return response.status(404).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});



// info API calls

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`
  <p>Phonebook has info for ${persons.length} people</p>
  <br/>
  <p>${date}</p>
`);
})


// configure the url PORT
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
