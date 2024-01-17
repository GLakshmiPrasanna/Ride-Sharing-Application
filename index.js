import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import FeedbackModel from './models/feedback.js'
import NotificationModel from './models/notification.js';

import UserModel from './models/user.js';
import RideModel from './models/ride.js';
import authenticateToken from './auth.js';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static("public"));

app.set('view engine', 'ejs');

const url="mongodb://127.0.0.1:27017/rideSharing";

mongoose.connect(url);

app.get('/',(req,res)=>{
    res.render('authentication');
});

app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  const user = new UserModel({ username, password, role });
  await user.save();
  res.status(201).json({ message: 'UserModel registered successfully' });
});

app.post('/login', async (req, res) => {
  const { username, password, role } = req.body;
  const user = await UserModel.findOne({ username, password, role });

  if (user) {
    const token = jwt.sign({ userId: user._id, role: user.role }, 'your-secret-key');
    if (user.role === 'traveler') {
        return res.render('travelerPage', { token });
    } else if (user.role === 'companion') {
        return res.render('companionPage', { token });
    } else if (user.role === 'admin') {
        return res.render('adminPage', { token });
    }
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/share-ride-details', authenticateToken, async (req, res) => {
    try {
        console.log('Received Token:', req.header('Authorization'));
        const { tripId, driverName, driverPhoneNumber, cabNumber, duration, companionUsername } = req.body;
        const ride = new RideModel({
            userId: req.user._id,
            companionUsername,
            tripId,
            driverName,
            driverPhoneNumber,
            cabNumber,
            duration
        });
        await ride.save();
        console.log(`Sending notification for tripId: ${tripId}`);

        res.json({ message: 'Ride details shared successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/review-audit-trail', authenticateToken, async (req, res) => {
    try {
        const auditTrail = await RideModel.find({ userId: req.user.userId });
        res.json({ auditTrail });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/companion-rides', authenticateToken, async (req, res) => {
    try {
        const { username } = req.user;
        const companionRides = await RideModel.find({ companionUsername: username });
        res.json({ companionRides });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/track-ride/:tripId', authenticateToken, async (req, res) => {
    try {
        const { tripId } = req.params;
        const { username } = req.user;
        const companionRide = await RideModel.findOne({
            companionUsername: username,
            tripId: tripId
        });
        if (companionRide) {
            console.log(`Tracking the ride with tripId: ${tripId}`);
            res.json({ message: `Tracking the ride with tripId: ${tripId}` });
        } else {
            res.status(403).json({ message: `Trip with this tripId ${tripId} is not shared with the companion.` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.post('/track-ride/:tripId', authenticateToken, async (req, res) => {
    try {
        const { tripId } = req.params;
        const { userId: travelerUserId, username: travelerUsername } = req.user;
        const ride = await RideModel.findOne({ tripId, companionUserId: travelerUserId });
        if (!ride) {
            return res.status(403).json({ message: 'This trip is not shared with you.' });
        }
        const completionTime = new Date(ride.completionTime - 5 * 60 * 1000);
        await NotificationModel.create({
            username: travelerUsername,
            message: `Five minutes until ride completion for your trip with Trip ID: ${tripId}.`,
            timestamp: completionTime,
        });
        res.json({ message: `Tracking the ride with tripId: ${tripId}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/complete-ride/:tripId', authenticateToken, async (req, res) => {
    try {
        const { tripId } = req.params;
        const { userId: travelerUserId, username: travelerUsername } = req.user;
        const ride = await RideModel.findOne({ tripId, companionUserId: travelerUserId });
        if (!ride) {
            return res.status(403).json({ message: 'This trip is not shared with you.' });
        }
        ride.status = 'completed';
        await ride.save();
        await NotificationModel.create({
            username: travelerUsername,
            message: `Your trip with Trip ID: ${tripId} has been completed.`,
        });
        res.json({ message: `Ride with tripId: ${tripId} marked as completed.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/share-feedback', authenticateToken, async (req, res) => {
    try {
      const { feedbackText } = req.body;
  
      const feedback = new FeedbackModel({
        userId: new mongoose.Types.ObjectId(req.user.userId.toString()),
        feedbackText,
    });
  
      await feedback.save();
      console.log(`Sharing feedback for userId: ${req.user.userId}`);
  
      res.json({ message: 'Feedback shared successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/companion-notifications', authenticateToken, async (req, res) => {
    try {
        const { username } = req.user;
        const notifications = await NotificationModel.find({ recipient: username, isRead: false });
        res.json({ notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/mark-notifications-as-read', authenticateToken, async (req, res) => {
    try {
        const { username } = req.user;
        await NotificationModel.updateMany({ recipient: username, isRead: false }, { $set: { read: true } });
        res.json({ message: 'Notifications marked as read successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.get('/view-all-rides', authenticateToken, async (req, res) => {
    try {
        const allRides = await RideModel.find();
        res.json({ allRides });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/access-feedback', authenticateToken, async (req, res) => {
    try {
        const allFeedback = await FeedbackModel.find();
        res.json({ allFeedback });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.listen(3000,()=>{
    console.log("Server Started !");
})