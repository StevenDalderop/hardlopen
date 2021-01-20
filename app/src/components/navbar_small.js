import React from 'react';

const NavbarSmall = (props) => {
  return (
    <nav class={"navbar navbar-expand-lg navbar-" + props.theme + " bg-" + props.theme}>
		  <div class="container-fluid">
	        <a class="navbar-brand" href="#">Running</a>
          <div class="ms-auto form-check form-switch">
            <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" onChange={(e) => props.onChange(e)} checked={props.theme === "dark"}></input>
            <label class="form-check-label" for="flexSwitchCheckDefault">Dark mode</label>
          </div>
	    </div>
    </nav>
  )
}
export default NavbarSmall;