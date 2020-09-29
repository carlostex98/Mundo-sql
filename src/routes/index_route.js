const express = require('express');
const router = express.Router();
const pool = require('../database');

const b = require('../helper/fullDatabase');

router.get('/', async (req, res) => {
    
    res.send("hola");
});

router.get('/eliminarTemporal', async (req, res) => {
    res.send("hola");
});

router.get('/eliminarModelo', async (req, res) => {
    res.send("hola");
});

router.get('/cargaTemporal', async (req, res) => {
    res.send("hola");
});

router.get('/cargaModelo', async (req, res) => {
    b.filModel();
    res.send("hola");
});




module.exports = router;