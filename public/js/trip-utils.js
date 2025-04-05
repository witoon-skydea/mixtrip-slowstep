/**
 * Utility functions for trip features
 */

// Format date for display
function formatDate(date) {
  if (!date) return '';
  
  const dateObj = new Date(date);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return dateObj.toLocaleDateString('th-TH', options);
}

// Calculate trip duration
function calculateTripDuration(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
}

// Generate days array from start and end dates
function generateDaysArray(startDate, endDate) {
  if (!startDate || !endDate) return [];
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dayCount = calculateTripDuration(startDate, endDate);
  
  const days = [];
  for (let i = 0; i < dayCount; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    
    days.push({
      date: currentDate.toISOString().split('T')[0],
      activities: []
    });
  }
  
  return days;
}

// Validate trip data
function validateTripData(tripData) {
  const errors = [];
  
  if (!tripData.title || tripData.title.trim() === '') {
    errors.push('กรุณาระบุชื่อทริป');
  }
  
  if (!tripData.startDate) {
    errors.push('กรุณาระบุวันที่เริ่มต้น');
  }
  
  if (!tripData.endDate) {
    errors.push('กรุณาระบุวันที่สิ้นสุด');
  }
  
  if (tripData.startDate && tripData.endDate) {
    const start = new Date(tripData.startDate);
    const end = new Date(tripData.endDate);
    
    if (start > end) {
      errors.push('วันที่สิ้นสุดต้องมาหลังวันที่เริ่มต้น');
    }
  }
  
  return errors;
}

// Create a trip card HTML
function createTripCardHTML(trip) {
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const duration = calculateTripDuration(trip.startDate, trip.endDate);
  
  return `
    <div class="trip-card">
      <a href="/trips/${trip._id}" class="trip-card-link">
        <div class="trip-card-image">
          ${trip.coverImage ? 
            `<img src="${trip.coverImage}" alt="${trip.title}">` : 
            `<div class="default-image">
              <i class="fas fa-map-marked-alt"></i>
            </div>`
          }
          <div class="trip-visibility ${trip.isPublic ? 'public' : 'private'}">
            <i class="fas ${trip.isPublic ? 'fa-globe' : 'fa-lock'}"></i>
          </div>
        </div>
        <div class="trip-card-content">
          <h3>${trip.title}</h3>
          <div class="trip-dates">
            <i class="fas fa-calendar-alt"></i>
            ${startDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} - 
            ${endDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
            (${duration} วัน)
          </div>
          ${trip.description ? 
            `<p class="trip-description">${trip.description.length > 100 ? trip.description.substring(0, 100) + '...' : trip.description}</p>` : 
            ''
          }
          <div class="trip-stats">
            <span><i class="fas fa-eye"></i> ${trip.viewCount}</span>
            <span><i class="fas fa-heart"></i> ${trip.likeCount}</span>
            <span><i class="fas fa-random"></i> ${trip.remixCount}</span>
          </div>
        </div>
      </a>
      <div class="trip-card-actions">
        <a href="/trips/${trip._id}/edit" class="btn-circle btn-edit" title="แก้ไขทริป">
          <i class="fas fa-edit"></i>
        </a>
        <button type="button" class="btn-circle btn-delete delete-trip-btn" title="ลบทริป" data-id="${trip._id}">
          <i class="fas fa-trash-alt"></i>
        </button>
        <form id="delete-form-${trip._id}" action="/trips/${trip._id}?_method=DELETE" method="POST" style="display: none;"></form>
      </div>
    </div>
  `;
}

// Add activity to day
function addActivityToDay(tripData, dayIndex, activity) {
  if (!tripData.days[dayIndex]) {
    return false;
  }
  
  if (!tripData.days[dayIndex].activities) {
    tripData.days[dayIndex].activities = [];
  }
  
  tripData.days[dayIndex].activities.push(activity);
  return true;
}

// Remove activity from day
function removeActivityFromDay(tripData, dayIndex, activityIndex) {
  if (!tripData.days[dayIndex] || !tripData.days[dayIndex].activities) {
    return false;
  }
  
  if (activityIndex < 0 || activityIndex >= tripData.days[dayIndex].activities.length) {
    return false;
  }
  
  tripData.days[dayIndex].activities.splice(activityIndex, 1);
  return true;
}

// Check if a location exists in the locations array
function isLocationExist(locations, location) {
  return locations.some(loc => 
    loc.placeId === location.placeId || 
    (loc.lat === location.lat && loc.lng === location.lng)
  );
}
