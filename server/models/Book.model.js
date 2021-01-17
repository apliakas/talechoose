const { Schema, model } = require("mongoose");

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

const Block = new Schema({
  title: {
    type: String,
    required: [true, "Block title is required"]
  },
  content: {
    type: String,
    required: [true, "Block content is required"]
  },
  decisions: {
    type: [Decision],
    required: false,
  },
});

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
  information: Object,
  appendix: Object,
  blocks: { 
    type: [Block],
    required: [true, "A book require at least one block."]
  },
  public: Boolean,
});

module.exports = model("book", Book);