import React from 'react';
import CSRFToken from '../components/csrftoken';

const LoginForm = () => {
  return (
	<div class="container">
		<h1 class="center"> Login </h1>

		<form id="login_form" action="/login" method="post">
			< CSRFToken />
			<label> Username </label>
			<input name="username" type="text"/>
			<label> Password </label> 
			<input name="password" type="password"/>
			<button class="btn btn-primary mt-3" type="submit" value="Login"> Login </button>
		</form>
	</div>
  )
}
export default LoginForm;