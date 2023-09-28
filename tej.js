const exp = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
var serviceAccount = require('./firebase-key.json');
var e = exp();

e.use(exp.static(path.join(__dirname, 'Login-Signup')));

initializeApp({
    credential: cert(serviceAccount)
});
const db = getFirestore();

e.use(session({
    secret: 'my-login-signup-45',
    resave: false,
    saveUninitialized: true
}));

e.use(exp.static(path.join(__dirname, '')));

e.use(bodyParser.urlencoded({ extended: true }));

e.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, 'main.html')); // Use 'path.join' to construct the file path
});

e.post("/signup", async function (req, res) {
    const email = req.body.username;
    const password = req.body.password;

    if (email && password) {
        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

            // Check if the email is already in the database
            db.collection('signup').where('Emailad', '==', email).get()
                .then(async (snapshot) => {
                    if (!snapshot.empty) {
                        // Email already exists
                        res.status(400).send("Email already in use. Try logging in.");
                    } else {
                        // Email is not in use, add it to the database with hashed password
                        await db.collection('signup').add({
                            Emailad: email,
                            Passwordad: hashedPassword, // Store the hashed password
                        });

                        req.session.user = email; // Store the user's email in the session
                        res.send("You signed up successfully with " + email);
                    }
                })
                .catch((error) => {
                    res.status(500).send("Error checking email availability: " + error.message);
                });
        } catch (error) {
            res.status(500).send("Error hashing password: " + error.message);
        }
    } else {
        res.status(400).send("Invalid data provided. Try Again!!!");
    }
});

e.post("/login", async function (req, res) {
    const email = req.body['username'];
    const password = req.body['password'];

    if (email && password) {
        try {
            // Check if the email is in the database
            const querySnapshot = await db.collection('signup').where('Emailad', '==', email).get();

            if (!querySnapshot.empty) {
                // Email exists in the database, check the password
                const userDoc = querySnapshot.docs[0]; // Assuming there's only one user with the given email

                const hashedPassword = userDoc.data().Passwordad;

                // Compare the provided password with the stored hashed password
                const passwordMatch = await bcrypt.compare(password, hashedPassword);

                if (passwordMatch) {
                    req.session.user = email; // Store the user's email in the session
                    res.redirect("/dashboard");
                } else {
                    res.send("Please check email or password.");
                }
            } else {
                res.send("Please check email or password.");
            }
        } catch (error) {
            res.status(500).send("Error during login: " + error.message);
        }
    } else {
        res.status(400).send("Invalid data provided. Try Again!!!");
    }
});

e.get("/dashboard", function (req, res) {
    if (req.session.user) {
      res.sendFile(path.join(__dirname, 'dashboard.html')); // Serve the dashboard page
    } else {
      res.redirect("/"); // Redirect to the login page if not logged in
    }
});

e.post("/logout", function (req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        // Redirect the user to the login page (main.html)
        res.sendStatus(200);
    });
});

e.listen(300,function(){
    console.log("Server started");
})
