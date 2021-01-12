import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from '../components/navbar';
import Table from '../components/table'

const baseUrl = window.location.protocol + "//" +window.location.host

function create_svg(data, column, select_id) {
	if (column === "speed") {
		var data2 = data.map(z => {return {"x": new Date(Date.parse(z.timestamp)), "y": z.speed}})
	} else {
		var data2 = data.map(z => {return {"x": new Date(Date.parse(z.timestamp)), "y": z.heart_rate}})
	}
	
	var margin = ({top: 20, right: 30, bottom: 30, left: 40})
	
	var width = 400
	
	var height = 400
	
	var x = d3.scaleTime()
		.domain([data2[0].x, data2[data2.length - 1].x]).nice()
		.range([margin.left, width - margin.right])

	var y = d3.scaleLinear()
		.domain([0, d3.max(data2, d => d.y)]).nice()
		.range([height - margin.bottom, margin.top])
		
	var xAxis = g => g
		.attr("transform", `translate(0,${height - margin.bottom})`)
		.call(d3.axisBottom(x).ticks(width / 100).tickSizeOuter(0))
		.selectAll("line,path").style("stroke", "currentcolor")
	
	var yAxis = g => g
		.attr("transform", `translate(${margin.left},0)`)
		.call(d3.axisLeft(y).ticks(10))
		.call(g => g.select(".domain").remove())
		.call(g => g.select(".tick:last-of-type text").clone()
			.attr("x", 3)
			.attr("text-anchor", "start")
			.attr("font-weight", "bold")
			.text(data2.y))	
		.selectAll("line,path").style("stroke", "currentcolor")
	
	var lineFunction = d3.line()
		.defined(d => !isNaN(d.y))
		.x(d => x(d.x))
		.y(d => y(d.y))
		
	let svg = d3.select(select_id)
		.attr("viewBox", [0, 0, width, height]);
	
	svg.append("path")
		.attr("fill", "none")
		.attr("stroke", "steelblue")
		.attr("stroke-width", 1.5)
		.attr("stroke-linejoin", "round")
		.attr("stroke-linecap", "round")
		.attr("d", lineFunction(data2));	
	
	svg.append("g")
		.call(xAxis)
		.selectAll("text").style("fill", "currentcolor")
	
	svg.append("g")
		.call(yAxis)
		.selectAll("text").style("fill", "currentcolor")	
}


function Lap(index, data) {
    if (data== null) { 
        return null
    } else {
        return (
            <tr>
				<td scope="row">{index + 1}</td>
				<td>{Math.floor(data.total_elapsed_time / 60)}:{Math.round(data.total_elapsed_time%60).padLeft()} </td>
				<td>{Math.round(data.total_distance * 100) / 100} km </td>
				<td>{getMinutePerKm(data.avg_speed)} min/km </td>
            </tr>            
        )
    }
}

Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}

function getMinutePerKm(km_per_hour) {
	var minutes = 60 / km_per_hour
	var minutes_rounded = Math.floor(60 / km_per_hour)
	var seconds = Math.floor((minutes % 1) * 60) 
	return minutes_rounded + ":" + seconds.padLeft()
}	

function getFormattedDate(date) {
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  
  var time = [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');
  
  return day + '/' + month + '/' + year + " " + time;
}

function getFormattedTime(seconds) {
	var minutes = seconds / 60 
	var minutes_rounded = Math.floor(minutes)
	var seconds_remainder = Math.round(seconds % 60)
	return minutes_rounded + ":" + seconds_remainder.padLeft()
}

function Session_data(props) {
    if (props == null) { 
        return null
    } else {
		var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        return (
			<div>
				<span><b>Date:</b> {days[new Date(Date.parse(props.timestamp)).getDay()]} {getFormattedDate(new Date(Date.parse(props.timestamp)))} </span> <br></br>
				<span><b>Time:</b> {getFormattedTime(props.total_elapsed_time)}</span> <br></br>
				<span><b>Distance:</b> {Math.round(props.total_distance * 100) / 100} km</span> <br></br>
				<span><b>Average speed:</b> {getMinutePerKm(props.avg_speed) + " min/km"}</span> <br></br>
				<span><b>Average heart rate:</b> {props.avg_heart_rate} </span> <br></br>
				<span><b>Max heart rate:</b> {props.max_heart_rate} </span> <br></br>
				<span><b>Average running cadence:</b> {props.avg_running_cadence} </span> 
			</div>
        )
    }
}

export default class Session extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "data_laps": null, 
			"data_session": null,
			"data_records": null, 
			"theme": "light",
        }
		this.session_id = this.props.match.params.session_id
    }
	
	handleChangeNav(e) {
		if (e.target.checked) {
			this.setState({"theme": "dark"})
			localStorage.setItem('theme', "dark");
			document.body.style.backgroundColor = 'rgb(' + 50 + ',' + 50 + ','+ 50 + ')';
			document.body.style.color = 'white';
		} else {
			this.setState({"theme": "light"})
			localStorage.setItem('theme', "light");
			document.body.style.backgroundColor = 'white';
			document.body.style.color = 'black';
		}
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
		
        fetch(`${baseUrl}/api/sessions/${this.session_id}/laps`)
            .then(response => response.json())
			.then(data => {
                this.setState({"data_laps": data.results});
            })
			.catch(err => console.log(err))
			

			
		fetch(`${baseUrl}/api/sessions/${this.session_id}`)
            .then(response => response.json())
			.then(data => {
                this.setState({"data_session": data});
            })
			.catch(err => console.log(err))
		
		
		fetch(`${baseUrl}/api/sessions/${this.session_id}/records`)
            .then(response => response.json())
			.then(data => {
                this.setState({"data_records": data})
			
				
				// create a red polyline from an array of LatLng points
				var latlngs = this.state.data_records.map((x) => [x["position_lat"], x["position_long"]])
				var latlngs_filtered = latlngs.filter(x => x[0] !== null)

				var mymap = L.map('mapid').setView([51.505, -0.09], 13)
				L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
					attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
					maxZoom: 18,
					id: 'mapbox/streets-v11',
					tileSize: 512,
					zoomOffset: -1,
					accessToken: 'pk.eyJ1Ijoic3RldmVuMTEyMzUiLCJhIjoiY2tjYnkwbWhrMjlwZDJzbzByaWszaDZ1MyJ9.Bcpu42XUMYTHTJxgvptT1w'
				}).addTo(mymap);
				mymap.setView([latlngs_filtered[0][0], latlngs_filtered[0][1]], 13)		
				
				var polyline = L.polyline(latlngs_filtered, {color: 'red'}).addTo(mymap);
				
				var data = this.state.data_records
				
				create_svg(data, "speed", "#svg1")
				create_svg(data, "heart_rate", "#svg2")								
            })
			.catch(err => console.log(err))
    }	

    render() {
        if (this.state.data_laps) {
            var list_lap = this.state.data_laps.map((data, index) => Lap(index, data));
        } else {
            var list_lap = null;
        }
		
		var session_data = Session_data(this.state.data_session)
		
        return (
			<div className={this.state.theme} >
				<Navbar theme={this.state.theme} onChange={(e) => this.handleChangeNav(e)} />
				<div id="content">
					<div className="grid-container">
						<div> 
							<h1> Speed </h1>
							<svg id="svg1"> </svg>
						</div>
						<div id="lap_container">
							<h1> Laps </h1>
							<div id="lap_table_container">
								< Table colnames={["#", "Time", "Distance", "Average speed"]} theme={this.state.theme} rows={list_lap} />
							</div>
						</div>
						<div> 
							<h1> Heart rate </h1>
							<svg id="svg2"> </svg>	
						</div>
						<div id="session_container"> 
							<h1> Session </h1>
							{session_data}
						</div>
						<div id="mapid"> 
						</div>
					</div> 
				</div>
			</div>
        )
    }
}