import React from "react";
import ReactDOM from 'react-dom';
import Homepage from './homepage'

export default class App extends React.Component {
	constructor(props) {
		super(props) 
	}
	
	render () {
		return (
				<div>
					<Homepage />
				</div>
		)
	}
}
		
const appDiv = document.getElementById("react_container");	
ReactDOM.render(<App />, appDiv);