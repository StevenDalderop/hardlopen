import React from 'react';
import CSRFToken from '../components/csrftoken';

const LoginForm = (props) => {
	var isDarkTheme = props.theme === "dark"
	var className = isDarkTheme ? "bg-dark" : "bg-light"
  return (
	<div id="login" className={className}>
		<h1 className="text-center"> Login </h1>

		<form id="login_form" action="/login" method="post">
			< CSRFToken />
			<label> Username </label>
			<input name="username" type="text"/>
			<label> Password </label> 
			<input name="password" type="password"/>
			<button className="btn btn-primary mt-3" type="submit" value="Login"> Login </button>
		</form>
	</div>
  )
}
export default LoginForm;