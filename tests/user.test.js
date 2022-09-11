const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should sign-up a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Johan Bouwsema',
        email: 'andrew@example.com',
        password: 'MyPas777!'
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    // expect(response.body.user.name).toBe('Johan Bouwsema')
    expect(response.body).toMatchObject({
        user: {
            name: 'Johan Bouwsema',
            email: 'andrew@example.com'
        },
        token: user.tokens[0].token
    })

    // Assert password is not stored in plain text
    expect(user.password).not.toBe('MyPas777!')

})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findOne({ email: userOne.email })
    expect(user.tokens[1].token).toBe(response.body.token)

})

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'notacorrectpassword'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenicated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOne._id)

    expect(user).toBeNull
})

test('Should not delete account for unauthenicated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    const response = await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOne._id)
    expect(user.avatar).toEqual(expect.any(Buffer))
})


test('Should update valid user fields', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ name: "Jaap Aap" })
        .expect(200)

    const user = await User.findById(userOne._id)
    expect(user.name).toBe("Jaap Aap")
})

test('Should not update valid user fields', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ location: "Test Location 1" })
        .expect(400)

    const user = await User.findById(userOne._id)
    expect(user.location).not.toBe("Test Location 1")
    expect(user.location).toBe(undefined)
})