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
	  <div class="container-fluid">
	  <a class="navbar-brand" href="#">Running</a>
	  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
		<span class="navbar-toggler-icon"></span>
	  </button>

	  <div class="collapse navbar-collapse" id="navbarSupportedContent">
		<ul class="navbar-nav mr-auto">
			<li class="nav-item">
				<a class="nav-link" href="/">Home <span class="sr-only"></span></a>
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
		<div class="ms-auto form-check form-switch">
	      <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" onChange={(e) => props.onChange(e)} checked={checked}></input>
		  <label class="form-check-label" for="flexSwitchCheckDefault">Dark mode</label>
		</div>
	  </div>
	  </div>
	</nav>
  )
}
export default Navbar;