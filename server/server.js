require('./config/config');

const _ = require('lodash');
//const path = require('path');
const express = require('express');
const request = require('request');
const {ObjectId} = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Person } = require('./model/person');
// const { response } = require('express');

const app = express();

const port = process.env.PORT;

// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");

app.use(express.json())
// app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, "public")));

// ============= PEOPLE API ROUTES ==================

// === Add a passenger ===
app.post('/people', (req, res) => {
    let person = new Person({
        name: req.body.name, 
        age: req.body.age,
        sex: req.body.sex,
        survived: req.body.survived,
        fare: req.body.fare,
        passengerClass: req.body.passengerClass,
        siblingsOrSpousesAboard: req.body.siblingsOrSpousesAboard,
        parentsOrChildrenAboard: req.body.parentsOrChildrenAboard,
    });

    person.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
})

// === Get all passengers ===
app.get('/people', (req, res) => {
    Person.find().then((people) => {
        res.send({ people });
    }, (e) => {
        res.status(400).send(e);
    });
});

// === Get a passenger ===
app.get('/people/:id', (req, res) => {
    const id = req.params.id;

    if(!ObjectId.isValid(id)) {
        return res.status(404).send('Invalid ID being sent');
    }

    Person.findById(id).then((person) => {
        if (!person) {
            return res.status(404).send('Person not found');
        }

        res.send({ person });
    }).catch((e) => {
        res.status(400).send();
    });
});

// === Delete a passenger ===
app.delete('/people/:id', (req, res) => {
    const id = req.params.id;

    if(!ObjectId.isValid(id)) {
        return res.status(404).send('Invalid ID being sent');
    }

    Person.findByIdAndRemove(id).then((person) => {
        if (!person) {
            return res.status(404).send('Person not found');
        }

        res.send({ person });
    }).catch((e) => {
        res.status(400).send();
    });
});

// === Update a passenger details ===
app.put('/people/:id', (req, res) => {
    const id = req.params.id;
    let body = _.pick(req. body, ['name', 'age', 'sex', 
        'survived', 'fare', 'passengerClass', 'siblingsOrSpousesAboard', 
        'parentsOrChildrenAboard']);

    if(!ObjectId.isValid(id)) {
        return res.status(404).send('Invalid ID being sent');
    }

    Person.findByIdAndUpdate(id, { $set: body }, { new: true }).then((person) => {
        if (!person) {
            return res.status(404).send('Person not found');
        }

        res.send({ person });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started up on port ${port}`);
});

module.exports =  {app} ;