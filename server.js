const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, 'events.json');

app.post('/events', (req, res) => {
    const { title, description, date, location, maxAttendees } = req.body;

  if (!title || !date || !location || !maxAttendees) {
    return res.status(400).json({ message: "Missing required fields" });
    }

    if(maxAttendees <= 0){
        return res.status(400).json({ message: "maxAttendees must be greater than zero" });
    }

    const newEvent = {
        id: Date.now(),
        title,
        description,
        date,
        location,
        maxAttendees
    };
    let events = [];
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        events = JSON.parse(data);
    }
    events.push(newEvent);
    fs.writeFileSync(filePath, JSON.stringify(events, null, 2));
    res.status(201).json(newEvent);
});
app.get('/events', (req, res) => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        const events = JSON.parse(data);
        res.json(events);
    } else {
        res.json([]);
    }   
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Welcome to the Event Hub API');
});