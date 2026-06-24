const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "selected",
        "rejected",
        "hold",
      ],
      required: true,
    },
    feedback: {
      type: String,
      trim: true,
      default: "",
    },

    recommendation: {
      type: String,
      enum: [
        "strong_hire",
        "hire",
        "no_hire",
      ],
      default: "hire",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Result",
  resultSchema
);