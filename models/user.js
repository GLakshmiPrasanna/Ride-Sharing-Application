import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: { type: String, enum: ['traveler', 'companion', 'admin'], default: 'traveler' },
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;