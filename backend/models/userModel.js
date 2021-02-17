const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  passwordConfirm: {
    type: String
  },
  phone: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  apartment: {
    type: String
  },
  zip: {
    type: Number,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  }
}, {timestamps: true});


// Encriptar la contraseña
userSchema.pre("save", async function(next) {
  // Retornar sin encriptar si la contraseña no fue modificada
  if(!this.isModified("password")) {
    next()
  }

  const salt = await bcryptjs.genSalt(12);
  const hashedPassword = await bcryptjs.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});


// Chequear la contraseña del usuario
userSchema.methods.checkPassword = async function(checkedPassword) {
  const checkResult = await bcryptjs.compare(checkedPassword, this.password);
  return checkResult;
}


module.exports = mongoose.model("User", userSchema);