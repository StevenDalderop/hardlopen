import React from 'react';
const Navbar = (props) => {
	
	var className = "navbar-light bg-light"
	if (props.theme === "dark") {
		className = "navbar-dark bg-dark"
	}
	
	var checked = false
	if (props.theme === "dark") checked = true
	
  return (
    <nav id="navbar" class={"navbar navbar-expand-lg " + className}>
	  <a class="navbar-brand" href="#">Running</a>
	  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
		<span class="navbar-toggler-icon"></span>
	  </button>

	  <div class="collapse navbar-collapse" id="navbarSupportedContent">
		<ul class="navbar-nav mr-auto">
			<li class="nav-item">
				<a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
			</li>
			<li class="nav-item">
			  <a class="nav-link" href="/wedstrijden">Wedstrijden </a>
			</li>
			<li class="nav-item">
			  <a class="nav-link" href="/schema">Schema </a>
			</li>
			<li class="nav-item">
			  <a class="nav-link" href="/logout">Logout</a>
			</li>
		</ul>
		<div class="custom-control custom-switch">
		  <input type="checkbox" class="custom-control-input" id="customSwitch1" onChange={(e) => props.onChange(e)} checked={checked}></input>
		  <label class="custom-control-label" for="customSwitch1">Dark mode</label>
		</div>
	  </div>
	</nav>
  )
}
export default Navbar;