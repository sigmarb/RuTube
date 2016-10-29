const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    }
});

const VideoEntity = mongoose.model("Video", VideoSchema);
module.exports = VideoEntity;