const express = require('express');
require('dotenv').config();
const route = express.Router();


route.get('/get-news/data', async (req, res) => {
    const { country, category } = req.query;
    const response= await fetch(`https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=${process.env.API_KEY}`)
        .then((response) => response.json())
        .then((result) => result)
        .catch((error) => console.error(error));
    return res.status(200).send(response);
});

module.exports = route;