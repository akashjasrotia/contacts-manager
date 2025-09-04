const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://akashjasrotia:AJFROM8A@cluster0.c0i3z2k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
module.exports = mongoose