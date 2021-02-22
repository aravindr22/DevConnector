const express = require('express'),
    app = express(),
    connectDB = require('./config/db');

const usersRoutes = require('./routes/api/users'),
    authRoutes = require('./routes/api/auth'),
    profileRoutes = require('./routes/api/profile'),
    postsRoutes = require('./routes/api/profile');

const PORT = process.env.PORT || 5000;

//Connecting database
connectDB();

app.get("/", (req, res) => {
    res.send("Api running");
});

//Define Routes
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postsRoutes);

app.listen(PORT, () => {
    console.log(`-----> Server Started on port ${PORT}`);
});