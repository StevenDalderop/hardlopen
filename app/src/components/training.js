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

function handleTrainingSubmitted(e, id, isChecked) {
	e.preventDefault()
	var csrftoken = getCookie('csrftoken')
	var method = isChecked ? "POST" : "DELETE"
    const requestOptions = {
      method: method,
      headers: { 
		"Content-Type": "application/json",
		'X-CSRFToken': csrftoken	  
	  },
      body: JSON.stringify({
        training_id: id,
      }),
	  credentials: 'same-origin',
    };
	if (method === "POST") {
		fetch("/api/training", requestOptions)
		  .then((response) => {response.json()})
		  .then((data) => console.log(data));
	} else {
		fetch("/api/training", requestOptions)
		  .then((response) => {console.log(response)})
	}
}
  
  
const Training = (props) => {
	var className = "training_div"
	var isChecked = props.checked.filter((x) => x.training_id === props.id).length > 0
	if (isChecked) className += " bg-primary"
	else className += " bg-secondary"
	var btnClassName = props.theme === "dark" ? "btn btn-dark ms-5" : "btn btn-light ms-5"

	return (
		<div id={ props.id } className={className}>
			<div className="training-title"> 
				<h5 className="mr-5"> Training { props.training_number }</h5>
				<div>
					<form onSubmit={(e) => handleTrainingSubmitted(e, props.id, isChecked)}> 
						<button style={{"width": "82.66px"}} onClick={() => props.handleChangeTraining(props.id, isChecked)} className={btnClassName}> { isChecked ? "Remove" : "Add"}</button>
					</form>
				</div>
			</div>
			<p> {props.training} </p>
		</div>
	)
}
export default Training;


