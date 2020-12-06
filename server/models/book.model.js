const { Schema, model } = require("mongoose");

const Book = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"]
  }, 
  description: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  information: [Object],
  appendix: [Object],
  blocks: { 
    type: [Block],
    required: [true, "A book require at least one block."]
  },
});

const Block = new Schema({
  title: {
    type: String,
    required: [true, "Block title is required"]
  },
  content: {
    type: String,
    required: [true, "Block content is required"]
  },
  decisions: [Decision],
});

const Decision = new Schema({
  option: {
    type: String,
    required: [true, "Decision option is required"]
  },
  toBlock: {
    type: String,
    required: [true, "Decision toBlock is required"]
  },
});

module.exports = model("book", Book);