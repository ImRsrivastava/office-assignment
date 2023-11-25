const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const Router = require('./Router');

app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // If needed
app.use(express.urlencoded({ extended: false })); 

// app.use('/uploads', express.static('./uploads'));

app.use('/', Router);






app.listen(9001, () => { console.log('Nodemon server started on port 9001'); });