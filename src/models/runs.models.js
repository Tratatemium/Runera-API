const mongoose = require("mongoose");

const RunSchema = new mongoose.Schema(
  {
    runId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    durationSec: {
      type: Number,
      required: true,
      min: 0,
    },
    distanceMeters: {
      type: Number,
      required: true,
      min: 0,
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
