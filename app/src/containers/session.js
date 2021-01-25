import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from '../components/navbar';
import Table from '../components/table'
import { getFormattedTime, getMinutePerKm, getFormattedDateTime, makeCancelable } from '../util'

const baseUrl = window.location.protocol + "//" +window.location.host

function create_svg(data, column, select_id) {
	if (column === "speed") {
		var data2 = data.map(z => {return {"x": new Date(Date.parse(z.timestamp)), "y": z.speed}})
	} else {
		var data2 = data.map(z => {return {"x": new Date(Date.parse(z.timestamp)), "y": z.heart_rate}})
	}
	
	var margin = ({top: 20, right: 25, bottom: 40, left: 50})
	
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

	var figureName = column === "speed" ? "Speed" : "Heart rate" 
	var yAxisName = figureName === "Speed" ? "km/h" : "bpm"

	svg.append("text")
		.attr("class", "x label")
		.attr("text-anchor", "end")
		.attr("x", width)
		.attr("y", height - 6)
		.text("Time")
		.style("fill", "currentcolor")

	svg.append("text")
		.attr("class", "y label")
		.attr("text-anchor", "end")
		.attr("x", 0)
		.attr("y", 0)
		.attr("dy", ".75em")
		.attr("transform", "rotate(-90)")
		.text(yAxisName)
		.style("fill", "currentcolor")
	
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
            <tr key={index}>
				<td scope="row">{index + 1}</td>
				<td>{Math.floor(data.total_elapsed_time / 60)}:{Math.round(data.total_elapsed_time%60).padLeft()} </td>
				<td>{Math.round(data.total_distance * 100) / 100} km </td>
				<td>{getMinutePerKm(data.avg_speed)} min/km </td>
            </tr>            
        )
    }
}

function Session_data(props) {
    if (props == null) { 
        return null
    } else {
		var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        return (
			<div>
				<span><b>Date:</b> {days[new Date(Date.parse(props.timestamp)).getDay()]} {getFormattedDateTime(new Date(Date.parse(props.timestamp)))} </span> <br></br>
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
		this.getSessionData = this.getSessionData() 
		this.getLapData = makeCancelable(fetch(`${baseUrl}/api/sessions/${this.session_id}/laps`))
		this.getRecordData = makeCancelable(fetch(`${baseUrl}/api/sessions/${this.session_id}/records`))
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

	getSessionData() {
		var cancelableRequest =  makeCancelable(fetch(`${baseUrl}/api/sessions/${this.session_id}`))
		cancelableRequest.promise.then(response => {
				if (!response.ok) {
					this.props.history.push("/");
					throw new Error('Session does not exist');
				} else {
					return response.json()
				}
			})			
			.then(data => {
				this.setState({"data_session": data});
			})
			.catch(err => console.log(err))
		return cancelableRequest
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
		
		
		this.getLapData.promise
			.then(response => response.json())
			.then(data => {
                this.setState({"data_laps": data.results});
            })
			.catch((reason) => console.log('isCanceled', reason.isCanceled));
					
		this.getRecordData.promise
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
			.catch((error) => console.log(error));
	}	
	
	componentWillUnmount() {
		this.getLapData.cancel()
		this.getRecordData.cancel()
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
							{ this.state.data_records ? <svg id="svg1"> </svg> : <div className={"loader bg-" + this.state.theme}> </div>}
						</div>
						<div id="lap_container">
							<h1> Laps </h1>
							<div id="lap_table_container">
								< Table colnames={["#", "Time", "Distance", "Average speed"]} theme={this.state.theme} rows={list_lap} />
							</div>
						</div>
						<div> 
							<h1> Heart rate </h1>
							{ this.state.data_records ? <svg id="svg2"> </svg> : <div className={"loader bg-" + this.state.theme}> </div>}	
						</div>
						<div id="session_container"> 
							<h1> Session </h1>
							{session_data}
						</div>
						{ this.state.data_records ? <div id="mapid"> </div> : <div id="mapid" className={"loader bg-" + this.state.theme}> </div>}						
					</div> 
				</div>
			</div>
        )
    }
}