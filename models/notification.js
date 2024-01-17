import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

const NotificationModel = mongoose.model('Notification', notificationSchema);

export default NotificationModel;