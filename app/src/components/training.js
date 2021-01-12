import React from 'react';

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function handleTrainingSubmitted(e, index, completed) {
	e.preventDefault()
	var csrftoken = getCookie('csrftoken')
    const requestOptions = {
      method: "POST",
      headers: { 
		"Content-Type": "application/json",
		'X-CSRFToken': csrftoken	  
	  },
      body: JSON.stringify({
        index: index,
		completed: completed
      }),
	  credentials: 'same-origin',
    };
	console.log("training submitted")
	fetch("/api/training", requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data));
}
  
  
const Training = (props) => {
	var className = "training_div"
	if (props.completed) className += " bg-primary"
	else className += " bg-secondary"
	var btnClassName = props.theme === "dark" ? "btn btn-dark ms-5" : "btn btn-light ms-5"

	return (
		<div className={className}>
			<div className="training-title"> 
				<h5 className="mr-5"> Training { props.training_nr }</h5>
				<div>
					<form onSubmit={(e) => handleTrainingSubmitted(e, props.index, props.completed)}> 
						<button style={{"width": "82.66px"}} onClick={() => props.handleChangeTraining(props.index)} 
						className={btnClassName}> { props.completed ? "Remove" : "Add"}</button>
					</form>
				</div>
			</div>
			<p> {props.description} </p>
		</div>
	)
}
export default Training;


