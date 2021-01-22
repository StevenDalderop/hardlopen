import React from 'react';

const NavbarSmall = (props) => {
  return (
    <nav className={"navbar navbar-expand-lg navbar-" + props.theme + " bg-" + props.theme}>
		  <div className="container-fluid">
	        <a className="navbar-brand" href="#">Running</a>
          <div className="ms-auto form-check form-switch">
            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" onChange={(e) => props.onChange(e)} checked={props.theme === "dark"}></input>
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Dark mode</label>
          </div>
	    </div>
    </nav>
  )
}
export default NavbarSmall;