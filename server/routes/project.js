const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login/login.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/registrar/main.html'));
});

router.get('/add_case', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/registrar/case.html'));
});

router.get('/add_login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/registrar/add.html'));
});

router.get('/records', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/registrar/records.html'));
});

router.get('/registrar', (req, res) =>{
    res.sendFile(path.join(__dirname, '../public/registrar/main.html'));
});

router.get('/pay', (req, res) =>{
    res.sendFile(path.join(__dirname, '../public/registrar/payment.html'));
});
module.exports = router;