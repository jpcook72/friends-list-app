const express = require('express');
const app = express();
const morgan = require('morgan');
const APIrouter = require('./API.js');
const path = require('path');
const { db } = require('../db/index.js');

//read jsons
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api', APIrouter);

app.use(express.static(path.join(__dirname,'..','public')))

app.use((req,res,next) => {
  console.log('yup main route')
    var err = new Error('Not a page');
    err.status = 404;
    next(err);
})

//error handling
app.use((err,req,res,next) => {
    res.status(err.status || 500).send('something is wrong -- ' + err.message)
})

const PORT = 8000;

const init = async function(){

    await db.sync({force: true});
  
    app.listen(PORT, function(){
      console.log("Server is listening on port ${PORT}!");
    })
  
  }
  
  init();
  