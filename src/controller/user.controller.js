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

        // Format date of birth
        const arrDOB = dob.split('-')
        console.log(arrDOB);
        const year = arrDOB[0]
        const month = arrDOB[1]
        const day = arrDOB[2]
        const newUser = await userModel.create({
            username: username,
            email: email,
            year: +year,
            month: +month,
            day: +day
        });

        console.log(`User Created: ${newUser}`);
        return res.status(201).json({msg: 'user created'})
    } catch (error) {
        console.log(error);
        return res.status(500).render('error')
    }
}