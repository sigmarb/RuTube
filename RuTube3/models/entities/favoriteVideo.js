const mongoose = require("mongoose");

const favoriteVideoSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    video_id: {
        type: String,
        required: true
    }
});

const favoriteVideoEntity = mongoose.model("favoriteVideo", favoriteVideoSchema);
module.exports = favoriteVideoEntity;