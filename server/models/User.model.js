const { Schema, model} = require("mongoose");

const userSchema = new Schema(
  {
    username: String,
    password: String,
    favouriteBooks: [
      {
        type: Schema.Types.ObjectId,
        ref: "book"
      }
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("user", userSchema);