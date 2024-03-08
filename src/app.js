// Importing Libraries
const express = require('express')
const cron = require('node-cron')
const path = require('path')
const {DateTime} = require('luxon')



// Importing modules
const db = require('./db/index')
const sendMail = require('./utils/nodemailer')
const userController = require('./controller/user.controller')
const userModel = require('./model/users')


// Connect Database
db.connectDB()

// App initialization
const app = express()


// View Engines
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


// Express Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))

// Main Routing
app.get('/', (req, res) => {
    console.log('index page');
    return res.status(200).render('index')
})

app.get('/register', (req, res) => {
    return res.status(200).render('register', {err: null, msg: null})
})
app.post('/send', userController.createUser)
app.get('/success', (req, res) => {
    return res.status(200).render('sent')
})

// async function schedule(){
//     console.log('hi');
//     const recipients = await userModel.find({})

//     if (recipients){
//         const DOB = recipients[0].dob
//         // const arrDOB = DOB.split('/').reverse()
//         // const utcDOB = DateTime.utc(+arrDOB[0], +arrDOB[1], +arrDOB[2]).ts
//         console.log(`DOB: ${DOB}`);
//         console.log(typeof DOB);
//         console.log(now == DOB);
//     }
    
// }

// schedule()

// console.log(1709818008245 > 1712102400000);
// console.log(1709818008245 > 1707264000000);
// console.log(1709818008245 > 1709769600000);

// Cron expression
cron.schedule('00 7 * * *', async () => {
    try {
        
        // Find recipients that will receive email at the stipulated time
        const now = DateTime.utc().startOf('day').ts
        console.log(now);

        const recipients = await userModel.find({
            dob: {
                $eq: now
            }
        })

        recipients.map(recipient => {
            // console.log(recipient.dob);
            // Email content
            const mailOptions = {
                email: recipient.email,
                subject: `Happy Birthday ${recipient.username}`,
                html: `
                <div>
                    <p>Dear ${recipient.username}</p>
                    <p>Happy Birthday</p>
                    <p>
                        On this special day, we want to wish you a happy birthday
                        <br/>
                        Best wishes,
                        <br/>
                        memento
                    </p>
                </div>
                `
            }
            return sendMail(mailOptions)
        })


    } catch (error) {
        console.log(`Error occured while sending emails: ${error}`);
    }
    console.log('every seconds');
})



// Invalid Route
app.use('*', (req, res) => {
    return res.status(404).render('error')
})


// Global Error Handling
app.use((err, req, res, next) => {
    return res.status(500).render('error')
})

// Port
const PORT = 3050


// Starting Server
app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
})


