const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ferry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ferry',
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['motorcycle', 'car', 'suv', 'truck'],
    required: true
  },
  boardingTime: {
    type: String,
    required: true
  },
  boardingDate: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'used', 'cancelled', 'expired'],
    default: 'pending'
  },
  qrCode: {
    type: String,
    required: true
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: true
  },
  passengerCount: {
    type: Number,
    default: 1,
    min: 1
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Gerar número do ticket antes de salvar
ticketSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Ticket').countDocuments();
    this.ticketNumber = `FERRY${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);