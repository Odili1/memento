const userModel = require('../model/users')
const {DateTime} = require('luxon')


exports.createUser = async (req, res) => {
    console.log(`new user: ${JSON.stringify(req.body)}`);
    try {
        const {username, email, dob} = req.body
        
        // Validation
        if (!username || !email || !dob) {
            return res.status(400).render('register', {err: 'Missing required fields', msg: null})
        }
        
        // Check if user already exist
        const existingUser = await userModel.find({email: email})
        console.log(`existingUser: ${existingUser}`);

        if (existingUser.length != 0) {
            return res.status(400).render('register', {err: "Recipient with this email already exists", msg: null})
        }

        // Format date to utc timing
        const arrDOB = dob.split('/').reverse()
        const utcDOB = DateTime.utc(+arrDOB[0], +arrDOB[1], +arrDOB[2]).ts
        const newUser = await userModel.create({
            username: username,
            email: email,
            dob: utcDOB
        });

        console.log(`User Created: ${newUser}`);
        return res.status(201).redirect('/success')
    } catch (error) {
        return res.status(500).render('error')
    }
}