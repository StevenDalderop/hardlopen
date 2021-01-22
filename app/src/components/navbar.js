import React, { useState, useEffect } from 'react';
import { getFormattedDate, makeCancelable } from '../util';

const baseUrl = window.location.protocol + "//" + window.location.host

const Navbar = (props) => {
	const [sessionData, setSessionData] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	var isDarkTheme = props.theme === "dark"

	var pages = [["/", "Home"], ["/trainingen", "Trainingen"], ["/wedstrijden", "Wedstrijden"], 
	["/schema", "Schema"]]

	useEffect(() => {
		var cancelableRequest = makeCancelable(fetch(`${baseUrl}/api/sessions/`))
		cancelableRequest.promise
            .then(res => res.json())
            .then(data => {
				setSessionData(data.results)
				setIsLoading(false)
			})
			.catch(error => console.log("isCancelled", error.isCancelled))
		return function cleanup() {
			cancelableRequest.cancel()
		}
    },[]);
	
	function link(href, name, current_page, index) {
		var isCurrentPage = name === current_page
		var className = isCurrentPage ? "nav-link active" : "nav-link"
		return (
			<li key={index} className="nav-item" >
				<a className={className} href={href}>{name}</a>
			</li>
		)
	}

	var links = pages.map((page, index) => link(page[0], page[1], props.active, index))

	function dropdown_item(nr) {
		return (<li key={nr.toString()}><a className="dropdown-item" href={"/session/" + sessionData[nr].index}>{getFormattedDate(sessionData[nr].timestamp)}</a></li>)
	}

	var dropdown_items = isLoading ? null : [0,1,2].map(nr => dropdown_item(nr))

  return (
    <nav id="navbar" className={"navbar navbar-expand-lg navbar-" + props.theme + " bg-" + props.theme}>
	  <div className="container-fluid">
		<a className="navbar-brand" href="#">Running</a>
		<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
			<span className="navbar-toggler-icon"></span>
		</button>

		<div className="collapse navbar-collapse" id="navbarSupportedContent">
			<ul className="navbar-nav mr-auto">
				{ links }
				<li className="nav-item dropdown">
					<a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
						Laatste sessies
					</a>
					<ul className="dropdown-menu" aria-labelledby="navbarDropdown">
						{ isLoading ? <li> Loading.. </li> :
							<div>
								{ dropdown_items}
							</div>
						}
					</ul>
				</li>
				<li className="nav-item" >
					<a className="nav-link" href="/logout">Logout</a>
				</li>
			</ul>
		
			<div className="ms-auto form-check form-switch">
				<input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" onChange={(e) => props.onChange(e)} checked={isDarkTheme}></input>
				<label className="form-check-label" htmlFor="flexSwitchCheckDefault">Dark mode</label>
			</div>
		</div>
		</div>
	</nav>
  )
}
export default Navbar;