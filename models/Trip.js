const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  coverImage: {
    type: String
  },
  locations: [
    {
      name: String,
      placeId: String,
      lat: Number,
      lng: Number,
      address: String
    }
  ],
  days: [
    {
      date: Date,
      activities: [
        {
          title: String,
          description: String,
          startTime: String,
          endTime: String,
          location: {
            name: String,
            placeId: String,
            lat: Number,
            lng: Number,
            address: String
          },
          notes: String,
          photos: [String]
        }
      ]
    }
  ],
  tags: [String],
  originalTrip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  },
  remixCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Trip', TripSchema);