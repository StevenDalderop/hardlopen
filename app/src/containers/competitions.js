import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from '../components/navbar';
import Table from '../components/table';
import { getFormattedSpeed } from '../util';

const baseUrl = window.location.protocol + "//" +window.location.host

var listItems = [{"filtered": "all", "name": "All competitions"}, {"filtered": "prs", "name": "Personal records"}, 
{"filtered": "best", "name": "Current personal records"}, {"filtered": 5, "name": "5 KM"}, {"filtered": 10, "name": "10 KM"}, 
{"filtered": 21.1, "name": "21.1 KM"}]

function DropDownItem(props) {
	return (<a className="dropdown-item" href="#" onClick={(e) => props.handleClick(e, props.filtered)}>
		{props.name} </a>)
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
		this.handleClick = this.handleClick.bind(this);
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

	handleClick(e, filtered) {
		e.preventDefault()
		this.setState({"filtered": filtered, "search": ""})
	} 
	
	render () {
		var name = this.state.filtered ? listItems.filter(x => x.filtered === this.state.filtered)[0].name : null
		var isDarkTheme = this.state.theme === "dark"
		var className = isDarkTheme ? " btn-dark" : " btn-primary"

		var wedstrijden = this.filterWedstrijden();
	
		var dropDownItems = listItems.map((item, index) => < DropDownItem key={index} filtered={item.filtered} name={item.name} 
			handleClick={(e, filtered) => this.handleClick(e, filtered)} />)
		
		return (
		<div className={this.state.theme} >
			<Navbar theme={this.state.theme} onChange={(e) => this.handleChangeNav(e)} active="Wedstrijden" />
			<div id="content" className="container center">
				<div id="buttons-group">
					<div className="dropdown">
					  <button className={"btn dropdown-toggle" + className} type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						{ name }
					  </button>
					  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
						{ dropDownItems }
					  </div>
					</div>
					<form className="form-inline my-lg-0 ms-3">
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


	filterWedstrijden() {
		if (this.state.filtered === "best") {
			let temp = [];
			for (let distance of [5, 10, 21.1, 42.2]) {
				let record = this.state.wedstrijden.filter((x) => { return x.isRecord && x.distance === distance; })[0];
				temp.push(<Matches_Row date={record.date} name={record.name} distance={record.distance}
					time={record.time} key={distance} />);
			}
			var wedstrijden = temp;
		}
		else if (this.state.filtered === null) {
			var wedstrijden = null;
		}
		else {
			var wedstrijden = this.state.wedstrijden.filter((x) => {
				if (this.state.search) {
					let regex = new RegExp(this.state.search, "i");
					return regex.test(x.date) || regex.test(x.distance) || regex.test(x.time) || regex.test(x.name);
				}
				else if (this.state.filtered === "all") { return x; }
				else if (this.state.filtered === "prs") { return x.isRecord; }
				else if (this.state.filtered === 5 || this.state.filtered === 10 || this.state.filtered === 21.1) {
					return x.distance === this.state.filtered;
				}
			}).map((data, index) => <Matches_Row date={data.date} name={data.name}
				distance={data.distance} time={data.time} key={index} />);
		}
		return wedstrijden;
	}
}
