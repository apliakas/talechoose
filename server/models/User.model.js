const { Schema, model} = require("mongoose");

const userSchema = new Schema(
  {
    username: String,
    password: String,
    books: [{ type: Schema.Types.ObjectId, ref: "books" }]
  },
  {
    timestamps: true,
  }
);

module.exports = model("user", userSchema);