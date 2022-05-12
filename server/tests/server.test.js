const expect = require('expect');
const request = require('supertest');
const { ObjectId } = require('mongodb');

const { app } = require('../server');
const { Person } = require('../model/person');

const people = [
    {
        _id: new ObjectId(),
        "name": "Okeke",
        "age": 27,
        "sex": "male",
        "survived": true,
        "fare": 73.1,
        "passengerClass": 3,
        "siblingsOrSpousesAboard": 1,
        "parentsOrChildrenAboard": 2
    },
    {
        _id: new ObjectId(),
        "name": "Varane",
        "age": 47,
        "sex": "male",
        "survived": true,
        "fare": 43.1,
        "passengerClass": 3,
        "siblingsOrSpousesAboard": 2,
        "parentsOrChildrenAboard": 2
    }
];

beforeEach((done) => {
    Person.deleteMany({}).then(() => {
        return Person.insertMany(people);
    }).then(() => done());
});

describe('POST /people', () => {
    it('should create a new person', (done) => {
        const person = {
            "name": "Julia",
            "age": 26,
            "sex": "female",
            "survived": true,
            "fare": 53.1,
            "passengerClass": 3,
            "siblingsOrSpousesAboard": 2,
            "parentsOrChildrenAboard": 2
        };

        const { name, age, sex, survived, fare, passengerClass, 
            siblingsOrSpousesAboard, parentsOrChildrenAboard } = person;

        request(app)
            .post('/people')
            .send({ name, age, sex, survived, fare, passengerClass, 
                siblingsOrSpousesAboard, parentsOrChildrenAboard })
            .expect(200)
            .expect((res) => {
                expect(res.body.name).toBe(name);
                expect(res.body.age).toBe(age);
                expect(res.body.sex).toBe(sex);
                expect(res.body.survived).toBe(survived);
                expect(res.body.fare).toBe(fare);
                expect(res.body.passengerClass).toBe(passengerClass);
                expect(res.body.siblingsOrSpousesAboard).toBe(siblingsOrSpousesAboard);
                expect(res.body.parentsOrChildrenAboard).toBe(parentsOrChildrenAboard);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Person.find({name}).then((people) => {
                    expect(people.length).toBe(1);
                    expect(people[0].name).toBe(name);
                    expect(people[0].age).toBe(age);
                    expect(people[0].sex).toBe(sex);
                    expect(people[0].survived).toBe(survived);
                    expect(people[0].fare).toBe(fare);
                    expect(people[0].passengerClass).toBe(passengerClass);
                    expect(people[0].siblingsOrSpousesAboard).toBe(siblingsOrSpousesAboard);
                    expect(people[0].parentsOrChildrenAboard).toBe(parentsOrChildrenAboard);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create a person with invalid body data', (done) => {
        request(app)
            .post('/people')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Person.find().then((people) => {
                    expect(people.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /people', () => {
    it('should get all persons', (done) => {
        request(app)
            .get('/people')
            .expect(200)
            .expect((res) => {
                expect(res.body.people.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /people/:id', () => {
    it('should return a person', (done) => {
        request(app)
            .get(`/people/${people[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.person.name).toBe(people[0].name);
            })
            .end(done);
    });

    it('should return 404 if person not found', (done) => {
        let hexId = new ObjectId().toHexString();

        request(app)
            .get(`/people/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get('/people/abc123')
            .expect(404)
            .end(done);
    })
});

describe('DELETE /people/:id', () => {
    it('should remove a person', (done) => {
        let hexId = people[1]._id.toHexString();

        request(app)
            .delete(`/people/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.person._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Person.findById(hexId).then((person) => {
                    expect(person).toBeFalsy();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404 if person not found', (done) => {
        let hexId = new ObjectId().toHexString();

        request(app)
            .delete(`/people/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete('/people/abc123')
            .expect(404)
            .end(done);
    });
});

describe('PUT /people/:id', () => {
    it('should update a person', (done) => {
        const hexId = people[0]._id.toHexString();
        const  name  = "Rat";

        request(app)
        .put(`/people/${hexId}`)
        .send({
            name
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.person.name).toBe(name);
        })
        .end(done);

    });

    it('should return 404 if person not found', (done) => {
        let hexId = new ObjectId().toHexString();

        request(app)
            .delete(`/people/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete('/people/abc123')
            .expect(404)
            .end(done);
    });

});