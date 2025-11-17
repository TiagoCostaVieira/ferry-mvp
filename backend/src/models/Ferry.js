const mongoose = require('mongoose');

const ferrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'inactive'],
    default: 'active'
  },
  currentStatus: {
    type: String,
    enum: ['boarding', 'waiting', 'departed', 'docked'],
    default: 'docked'
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  currentOccupancy: {
    type: Number,
    default: 0,
    min: 0
  },
  route: {
    from: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    }
  },
  schedule: [{
    time: String,
    day: {
      type: String,
      default: 'all'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  prices: {
    motorcycle: Number,
    car: Number,
    suv: Number,
    truck: Number
  }
}, {
  timestamps: true
});

// APENAS virtuals essenciais - comentar os problemáticos
ferrySchema.virtual('availableCapacity').get(function() {
  return this.capacity - this.currentOccupancy;
});

ferrySchema.virtual('formattedRoute').get(function() {
  return `${this.route.from} → ${this.route.to}`;
});

// REMOVER o virtual nextTrip por enquanto
// ferrySchema.virtual('nextTrip').get(function() {
//   return this.schedule && this.schedule[0] ? this.schedule[0].time : null;
// });

module.exports = mongoose.model('Ferry', ferrySchema);