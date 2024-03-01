// const express = require('express')
// const path = require('path')
// const bcrypt = require('bcrypt')
// const Collection = require('./config')
// const validator = require('validator')

// const app = express()

// app.use(express.json())
// app.use(express.urlencoded({extended:false}))

// app.set('view enginge' , 'ejs')

// // app.get('/', (req,res)=>{
// //     res.render('login')
// // })

// // app.get('/signup' , (req,res)=>{
// //     res.render('signup')
// // })

// // add users
// app.post('/users' , async (req,res)=>{
//     const data = {
//         email: req.body.email,
//         password: req.body.password
//     }
//     const existingUser = await Collection.findOne({email: data.email})

//     if (existingUser) {
//         res.status(400).send('User already exist')
//     }else{
//         const saltRounds = 10
//         // const hashedPassowred = await bcrypt.hash(data.password , saltRounds)
//         // data.password = hashedPassowred
//         const userData = await Collection.insertMany(data)
//         console.log(userData)
//     }
//     return
// })

// // login

// app.post('/login' , async(req,res)=>{
//     try{
//         const check = await Collection.findOne({email: req.body.email})
//         if (!check) {
//             res.status(404).send('User not found')
//         }else{
//             res.status(200).send(check)
//         }
//         // const isPasswordMatch = await bcrypt.compare(req.body.password , check.password)
//         // if (isPasswordMatch) {
//         // res.status(400).send('Wrong password')
//         // }
//     }catch{
//         res.send('Wrong detailes')
//     }
// })


// const port = 3000
// app.listen(port , ()=>{
//     console.log('server running on port' + port)
// })

const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const Collection = require('./config');
const validator = require('validator');

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/users', async (req, res) => {
    const { email, password } = req.body;

    // Validate email format
    if (!validator.isEmail(email)) {
        return res.status(400).send('Invalid email format');
    }

    try {
        const existingUser = await Collection.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await Collection.create({ email, password: hashedPassword });

        console.log('User created:', newUser);
        return res.status(201).send('User created successfully');
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).send('Internal server error');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Collection.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).send('Incorrect password');
        }

        return res.status(200).send('Login successful');
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Internal server error');
    }
});

const port = 3000;
app.listen(port, () => {
    console.log('Server running on port ' + port);
});
