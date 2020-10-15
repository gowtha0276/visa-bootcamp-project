const express = require('express')
const cors = require('cors')
var path = require('path');
const bodyParser = require('body-parser')
const app = express()

app.use(cors())
app.use(bodyParser.json())


app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

app.post('/register', (req, res) => {
    console.log(req.body)
   console.log("Register")
})

app.get('/', (req, res) => {
   res.send('Hello World!')
 })

var PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
