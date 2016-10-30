const mongoose = require("mongoose");

const FavoriteVideoSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    video_id: {
        type: String,
        required: true
    }
});

const FavoriteVideoEntity = mongoose.model("FavoriteVideo", FavoriteVideoSchema);
module.exports = FavoriteVideoEntity;