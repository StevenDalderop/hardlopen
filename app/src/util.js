Number.prototype.padLeft = function(base,chr) {
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0 ? new Array(len).join(chr || '0')+this : this;
}

export function getFormattedDate(timestamp) {
	var date = new Date(Date.parse(timestamp))
	var year = date.getFullYear();
  
	var month = (1 + date.getMonth()).toString();
	month = month.length > 1 ? month : '0' + month;
  
	var day = date.getDate().toString();
	day = day.length > 1 ? day : '0' + day;
	
	
    return day + '/' + month + '/' + year;
}

export function getFormattedDateTime(timestamp) {
    var date = new Date(Date.parse(timestamp))
    var year = date.getFullYear();
  
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
  
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    
    var time = [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');
    
    return day + '/' + month + '/' + year + " " + time;
  }

export function getMinutePerKm(km_per_hour) {
	var minutes = 60 / km_per_hour
	var minutes_rounded = Math.floor(60 / km_per_hour)
	var seconds = Math.floor((minutes % 1) * 60) 
	return minutes_rounded + ":" + seconds.padLeft()
}	

export function getFormattedTime(seconds) {
	var minutes = seconds / 60 
	var minutes_rounded = Math.floor(minutes)
	var seconds_remainder = Math.round(seconds % 60)
	return minutes_rounded + ":" + seconds_remainder.padLeft()
}

export function getFormattedDistance(km) {
	return Math.round(km * 100) / 100
}	

export function getFormattedSpeed(km, formatted_time) {
	var pattern = /\d+/g
	var result = formatted_time.match(pattern)
	var hours = parseInt(result[0])
	var minutes = parseInt(result[1])
	var seconds = parseInt(result[2])
	var total_seconds = hours * 60 * 60 + minutes * 60 + seconds
	var seconds_per_km = total_seconds / km
	return Math.floor(seconds_per_km  / 60) + ":" + Math.round(seconds_per_km % 60).padLeft()
}	

export const makeCancelable = (promise) => {
	let hasCanceled_ = false;
  
	const wrappedPromise = new Promise((resolve, reject) => {
	  promise.then(
		val => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
		error => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
	  );
	});
  
	return {
	  promise: wrappedPromise,
	  cancel() {
		hasCanceled_ = true;
	  },
	};
  };