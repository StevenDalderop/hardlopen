import React from 'react';
import CSRFToken from './csrftoken';

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

function handleTrainingButtonClicked(id) {
	var csrftoken = getCookie('csrftoken')
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({
        training_id: id,
		csrfmiddlewaretoken: csrftoken,
      }),
	  credentials: 'same-origin',
    };
    fetch("/api/training", requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data));
}
  
  
const Training = (props) => {
	var className = "training_div"
	var isChecked = props.checked.filter((x) => x.training_id === props.id).length > 0
	if (isChecked) className += " bg_success"
	else if (props.theme === "dark") className += " bg_no_success_dark"
	else className += " bg_no_success"

	return (
		<div id={ props.id } className={className}>
			<div className="flex"> 
				<h5 className="mr-3"> Training { props.training_number }</h5>
				<div>
					<form> 
						< CSRFToken />
						<input name={props.id} type="hidden" value = { 0 }></input>
						<input name={props.id} value={ 1 } onClick={(e) => props.handleCheckBox(e, props.id)} type="checkbox" 
							checked={isChecked} className="mr-1" id={"exampleCheck" + props.id}></input>
						<label className="form-check-label" htmlFor={"exampleCheck" + props.id}>Voltooid</label>
					</form>
					<button className="btn btn-primary ml-3" onClick={(e) => handleTrainingButtonClicked(props.id)}> Submit</button>
				</div>
			</div>
			<ul>
				<li> {props.training} </li>
			</ul>
		</div>
	)
}
export default Training;


