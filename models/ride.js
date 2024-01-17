import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
    userId: mongoose.Types.ObjectId,
    companionUsername: String,
    tripId: String,
    driverName: String,
    driverPhoneNumber: String,
    cabNumber: String,
    duration: String,
    status: { type: String, default: 'In Progress' },
});
  
const RideModel = mongoose.model('Ride', rideSchema);

export default RideModel;