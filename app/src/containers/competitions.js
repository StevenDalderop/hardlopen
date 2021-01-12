import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from '../components/navbar';
import Table from '../components/table';

const baseUrl = window.location.protocol + "//" +window.location.host

Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0 ? new Array(len).join(chr || '0')+this : this;
}

function getFormattedSpeed(km, formatted_time) {
	var pattern = /\d+/g
	var result = formatted_time.match(pattern)
	var hours = parseInt(result[0])
	var minutes = parseInt(result[1])
	var seconds = parseInt(result[2])
	var total_seconds = hours * 60 * 60 + minutes * 60 + seconds
	var seconds_per_km = total_seconds / km
	return Math.floor(seconds_per_km  / 60) + ":" + Math.round(seconds_per_km % 60).padLeft()
}	

function Matches_Row(props) {
	return (
		<tr> 
			<td> {props.date} </td>
			<td> {Math.round(props.distance * 100) / 100 + " km"} </td>
			<td> {props.time} </td>
			<td> {getFormattedSpeed(props.distance, props.time) + " min/km"} </td>
			<td> {props.name} </td>
		</tr>
	)
}

export default class Competitions extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			"wedstrijden": null,
			"filtered": null,
			"prs": false,
			"search": "",
			"theme": "light",
		}
		this.handleChange = this.handleChange.bind(this);
	}
	
	componentDidMount() {
		if (!localStorage.getItem('theme')) {
			localStorage.setItem('theme', "light");
		}
		
		let theme = localStorage.getItem('theme');
		if (theme === "dark") { 
			document.body.style.backgroundColor = 'rgb(' + 50 + ',' + 50 + ','+ 50 + ')';
			document.body.style.color = 'white';
		}
		this.setState({"theme": theme})
		
		fetch(`${baseUrl}/api/matches`)
		    .then(res => res.json())
			.then(data => {
				console.log(data)
				this.setState({"wedstrijden": data.results})
				this.setState({"filtered": "all"})
				})
			.catch(err => console.log(err))
	}
	
	handleChange(e) {
		this.setState({"search": e.target.value, "filtered": "all"});
	}
	
	handleChangeNav(e) {
		if (e.target.checked) {
			this.setState({"theme": "dark"})
			localStorage.setItem('theme', "dark");
		} else {
			this.setState({"theme": "light"})
			localStorage.setItem('theme', "light");
		}
	}
	
	render () {
		if (this.state.filtered === "all") {
            var wedstrijden = this.state.wedstrijden.map((data) => Matches_Row(data));
			var name = "All competitions"
        } else if (this.state.filtered === "best") {
			let temp = []
			for (let distance of [5, 10, 21.1, 42.2]) {
				let record = this.state.wedstrijden.filter((x) => {return x.isRecord && x.distance === distance})[0]
				temp.push(Matches_Row(record))
			}
			var wedstrijden = temp
			var name = "Current personal records"
		}  else if (this.state.filtered === "prs") {
			var wedstrijden = this.state.wedstrijden.filter((x) => {return x.isRecord}).map((data) => Matches_Row(data));
			var name = "Personal records"
		} else if (this.state.filtered === 5 || this.state.filtered === 10 || this.state.filtered === 21.1) {
			var wedstrijden = this.state.wedstrijden.filter((x) => {return x.distance === this.state.filtered}).map((data) => Matches_Row(data));
			var name = this.state.filtered.toString() + " KM"
		} else {
            var wedstrijden = null;
        }
		
		if (this.state.search) {
			var wedstrijden = this.state.wedstrijden.filter((x) => {let regex = new RegExp(this.state.search, "i"); return regex.test(x.date) || regex.test(x.distance) || regex.test(x.time) || regex.test(x.name)}).map((data) => Matches_Row(data));
		}			
		
		var btn_className = "btn dropdown-toggle"
		if (this.state.theme === "dark") {btn_className += " btn-dark"}
		else {btn_className += " btn-primary"}
		
		
		return (
		<div className={this.state.theme} >
			<Navbar theme={this.state.theme} onChange={(e) => this.handleChangeNav(e)} />
			<div id="content" className="container center">
				<div id="buttons-group">
					<div className="dropdown">
					  <button className={btn_className} type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						{ name }
					  </button>
					  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
						<a className="dropdown-item" href="#" onClick={() => this.setState({"filtered": "all", "search": ""})}>All competitions </a>
						<a className="dropdown-item" href="#" onClick={() => this.setState({"filtered": "prs", "search": ""})}>Personal records</a>
						<a className="dropdown-item" href="#" onClick={() => this.setState({"filtered": "best", "search": ""})}>Current personal records</a>
						<a className="dropdown-item" href="#" onClick={() => this.setState({"filtered": 5, "search": ""})}>5 KM</a>
						<a className="dropdown-item" href="#" onClick={() => this.setState({"filtered": 10, "search": ""})}>10 KM</a>
						<a className="dropdown-item" href="#" onClick={() => this.setState({"filtered": 21.1, "search": ""})}>21.1 KM</a>
					  </div>
					</div>
					<form className="form-inline my-lg-0 mx-3">
					  <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" value={this.state.search} onChange={this.handleChange}></input>
					</form>
				</div>
				<div className="table_container">
					<Table colnames={["Date", "Distance", "Time", "Speed", "Name"]} rows={wedstrijden} theme={this.state.theme} />
				</div>
			</div>			
		</div>
		)
	}	
}
