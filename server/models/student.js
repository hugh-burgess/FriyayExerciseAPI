const mongoose = require("mongoose");

const { Schema } = mongoose;

const StudentSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    course: Number,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Student", StudentSchema);
