const mongoose = require('mongoose');

mongoose.connect("mongodb://0.0.0.0:27017/login")
    .then(() => {
        console.log(`Connection successful`);
    })
    .catch((err) => {
        console.error(`Connection failed: ${err}`);
    })
    .finally(() => {
        console.log(`Server started listening on port http://localhost:3000`);
    });