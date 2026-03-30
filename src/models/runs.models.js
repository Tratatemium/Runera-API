const mongoose = require("mongoose");

const RunSchema = new mongoose.Schema(
  {
    runId: { type: String, required: true },
    userId: { type: String, required: true },

    startTime: { type: Date, required: true, default: Date.now },
    date: { type: Date, required: true },

    durationSec: { type: Number, required: true, min: 1 },
    distanceMeters: { type: Number, required: true, min: 1 },

    paceSecPerKm: { type: Number, required: true, min: 0 },

    title: String,
    notes: String,

    perceivedEffort: {
      type: Number,
      min: 1,
      max: 10,
    },

    weather: {
      type: String,
      enum: ["sunny", "cloudy", "rain", "snow", "windy", "hot", "cold"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

RunSchema.index({ runId: 1 }, { unique: true });
// Optional compound index for user + startTime queries
RunSchema.index({ userId: 1, startTime: -1 });

module.exports = mongoose.model("Run", RunSchema);
