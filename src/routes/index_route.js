const express = require('express');
const router = express.Router();
const modelo = require('../helper/actuarModelo');
const temporal = require('../helper/actuarTemporal');

const c1 = require('../helper/consulta1');
const c2 = require('../helper/consulta2');
const c3 = require('../helper/consulta3');
const c4 = require('../helper/consulta4');
const c5 = require('../helper/consulta5');
const c6 = require('../helper/consulta6');
const c7 = require('../helper/consulta7');
const c8 = require('../helper/consulta8');
const c9 = require('../helper/consulta9');
const c10 = require('../helper/consulta10');


router.get('/', async (req, res) => {
    res.send("Hoooola");
});

router.get('/eliminarTemporal', async (req, res) => {
    res.send(await temporal.vaciar());
});

router.get('/eliminarModelo', async (req, res) => {
    res.send(await modelo.eliminarModelo());
});

router.get('/cargarTemporal', async (req, res) => {
    res.send(await temporal.llenar());
});

router.get('/cargarModelo', async (req, res) => {
    res.send(await modelo.llenarModelo());
});

router.get('/consulta1', async (req, res) => {
    res.send(await c1.consulta());
});

router.get('/consulta2', async (req, res) => {
    res.send(await c2.consulta());
});

router.get('/consulta3', async (req, res) => {
    res.send(await c3.consulta());
});

router.get('/consulta4', async (req, res) => {
    res.send(await c4.consulta());
});

router.get('/consulta5', async (req, res) => {
    res.send(await c5.consulta());
});

router.get('/consulta6', async (req, res) => {
    res.send(await c6.consulta());
});

router.get('/consulta7', async (req, res) => {
    res.send(await c7.consulta());
});

router.get('/consulta8', async (req, res) => {
    res.send(await c8.consulta());
});

router.get('/consulta9', async (req, res) => {
    res.send(await c9.consulta());
});

router.get('/consulta10', async (req, res) => {
    res.send(await c10.consulta());
});


module.exports = router;