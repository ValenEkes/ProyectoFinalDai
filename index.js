import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'

const express = require('express');
const { Pool } = require('pg');

const app = express();
const port=process.env.PORT||3001

app.use(cors())

app.get('/', (req, res) => {
    res.send('Bienvenido desde el backend');
  });

const pool=new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD  
})

app.listen(port,()=>{
    console.log(`Listening on http://localhost:${port}`);
})