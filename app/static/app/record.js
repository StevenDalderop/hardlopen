const baseUrl = "https://running-dashboard.herokuapp.com/"

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
	
	var yAxis = g => g
		.attr("transform", `translate(${margin.left},0)`)
		.call(d3.axisLeft(y).ticks(10))
		.call(g => g.select(".domain").remove())
		.call(g => g.select(".tick:last-of-type text").clone()
			.attr("x", 3)
			.attr("text-anchor", "start")
			.attr("font-weight", "bold")
			.text(data2.y))	
	
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
		.call(xAxis);
	
	svg.append("g")
		.call(yAxis);
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
				<td>{Math.round(data.avg_speed * 100) / 100} km/h </td>
            </tr>            
        )
    }
}

Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
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

function Session_data(props) {
    if (props == null) { 
        return null
    } else {
		var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        return (
			<div>
				<span><b>Date:</b> {days[new Date(Date.parse(props.timestamp)).getDay()]} {getFormattedDate(new Date(Date.parse(props.timestamp)))} </span> <br></br>
				<span><b>Time:</b> {Math.floor(props.total_elapsed_time / 60)}:{Math.round(props.total_elapsed_time%60).padLeft()}</span> <br></br>
				<span><b>Distance:</b> {Math.round(props.total_distance * 100) / 100} km</span> <br></br>
				<span><b>Average speed:</b> {Math.round(props.avg_speed * 100) / 100} km/h</span> <br></br>
				<span><b>Average heart rate:</b> {props.avg_heart_rate} </span> <br></br>
				<span><b>Max heart rate:</b> {props.max_heart_rate} </span> <br></br>
				<span><b>Average running cadence:</b> {props.avg_running_cadence} </span> 
			</div>
        )
    }
}

class Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "data_laps": null, 
			"data_session": null,
			"data_records": null, 
        }
		this.axiosCancelSource = axios.CancelToken.source()
    }

    componentDidMount() {
		
        axios.get(`${baseUrl}/app/api/sessions/${id}/laps`, {cancelToken: this.axiosCancelSource.token})
            .then(res => {
                this.setState({"data_laps": res.data});
            })
			.catch(err => console.log(err))
			
		axios.get(`${baseUrl}/app/api/sessions/${id}`, {cancelToken: this.axiosCancelSource.token})
            .then(res => {
                this.setState({"data_session": res.data});
            })
			.catch(err => console.log(err))
		
		
		axios.get(`${baseUrl}/app/api/sessions/${id}/records`, {cancelToken: this.axiosCancelSource.token})
            .then(res => {
                this.setState({"data_records": res.data});
				
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
	
	componentWillUnmount() {
		this.axiosCancelSource.cancel("Axios request cancelled")
	}		

    render() {
        if (this.state.data_laps) {
            var list_lap = this.state.data_laps.map((data, index) => Lap(index, data));
        } else {
            var list_lap = null;
        }
		
		var session_data = Session_data(this.state.data_session)
		
        return (
			<div className="grid-container">
				<div> 
					<h1> Speed </h1>
					<svg id="svg1"> </svg>
				</div>
				<div id="lap_container">
					<h1> Laps </h1>
					<div id="lap_table_container">
						<table className="table table-hover">
							<thead>
								<tr>
									<th scope="col">#</th>
									<th scope="col">Time</th>
									<th scope="col">Distance</th>
									<th scope="col">Average speed</th>
								</tr>
							</thead>
							<tbody>
								{list_lap}
							</tbody>
						</table>
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
        )
    }
}

const domContainer = document.querySelector('#react_container');
ReactDOM.render(<Container />, domContainer);