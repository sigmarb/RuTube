const mongoose = require("mongoose");

const CloseFriendSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    friend_id: {
        type: String,
        required: true
    }
});

const CloseFriendEntity = mongoose.model("CloseFriend", CloseFriendSchema);
module.exports = CloseFriendEntity;