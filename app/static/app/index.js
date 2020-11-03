const baseUrl = "https://running-dashboard.herokuapp.com/"

var maanden = {"1": "jan", "2": "feb", "3": "mar", "4": "apr", "7": "juli", "10": "okt"}

function sumDistance(total, num) {
  return total + num.total_distance;
}
	
var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
	(rv[x[key]] = rv[x[key]] || []).push(x);
	return rv;
  }, {});
};

function createDateRange(start, end) {
	var date = new Date(start.getFullYear(), start.getMonth())
	let data = []
	while (true) {	
		let month = date.getMonth() + 1
		let year = date.getFullYear()
		if (month === 12) {
			month = 0
			year = year + 1
		}
		date = new Date(year, month)
		if (date > end) {
			break
		}	
		data.push(date)		
	}
	return data
}

function bar_plot(data_input, id_name, timeframe, width, height) {
	var margin = ({top: 30, right: 5, bottom: 30, left: 40})
	
	data_input = data_input.map(x => {return {"timestamp": x.timestamp, "total_distance": x.total_distance}})
		
	function SortByTimestamp(x,y) {
      return ((x.timestamp == y.timestamp) ? 0 : ((x.timestamp > y.timestamp) ? 1 : -1 ));
    }
    data_input.sort(SortByTimestamp);
	
	let start = data_input[0].timestamp
	let end = data_input[data_input.length - 1].timestamp
	
	let dateRange = createDateRange(start, end)
	let zeroData = dateRange.map(x => {return {"timestamp": x, "total_distance": 0}})
	
	data_input = data_input.concat(zeroData)
	
	data_input.sort(SortByTimestamp);
	
	if (timeframe === "year") {	
		let data2 = data_input.map(x => { return {"year": x.timestamp.getFullYear(), "total_distance": x.total_distance}})
		var data3 = groupBy(data2, "year")
	} else {
		let data2 = data_input.map(x => { return {"month": String(x.timestamp.getFullYear()) + " " + String(x.timestamp.getMonth() + 1), "total_distance": x.total_distance}})
		var data3 = groupBy(data2, "month")
	}	

	var data = []

	for (var key in data3) { data.push({date: key, value: data3[key].reduce(sumDistance, 0)})}
	
	const svg = d3.select(id_name)
		.attr("viewBox", [0, 0, width, height]);	
	
	var x = d3.scaleBand()
		.domain(d3.range(data.length))
		.range([margin.left, width - margin.right])
		.padding(0.1)
		
	var y = d3.scaleLinear()
		.domain([0, d3.max(data, d => d.value)]).nice()
		.range([height - margin.bottom, margin.top])
	
	svg.append("g")
		.attr("fill", "steelblue")
		.selectAll("rect")
		.data(data)
		.join("rect")
		  .attr("x", (d, i) => x(i))
		  .attr("y", d => y(d.value))
		  .attr("height", d => y(0) - y(d.value))
		  .attr("width", x.bandwidth());
	
	if (timeframe === "year") {
		var xAxis = g => g
			.attr("transform", `translate(0,${height - margin.bottom})`)
			.call(d3.axisBottom(x).tickFormat(i => data[i].date).tickSizeOuter(0)) 
	} else {
		var xAxis = g => g
			.attr("transform", `translate(0,${height - margin.bottom})`)
			.call(d3.axisBottom(x).tickFormat(i => { 
				if (data[i].date.split(" ")[1] === "1") {
					return data[i].date.split(" ")[0]
				} else if (["4", "7", "10"].indexOf(data[i].date.split(" ")[1]) !== -1) {
					return maanden[data[i].date.split(" ")[1]]
				} else {
				return null
			}})
			.tickSizeOuter(0)) 
	}
	
	var yAxis = g => g
		.attr("transform", `translate(${margin.left},0)`)
		.call(d3.axisLeft(y).ticks(null, data.format))
		.call(g => g.select(".domain").remove())
		.call(g => g.append("text")
			.attr("x", -margin.left + 5)
			.attr("y", 10)
			.attr("fill", "currentColor")
			.attr("text-anchor", "start")
			.text("Total distance"))
	
    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);	
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

function Session_row(props) {
    if (props == null) { 
        return null
    } else {
        return (
            <tr>
				<td><a href={props.index}>{getFormattedDate(new Date(Date.parse(props.timestamp)))}</a></td>
				<td>{Math.round(props.total_elapsed_time / 60)}</td>
				<td>{Math.round(props.total_distance * 100) / 100}</td>
				<td>{Math.round(props.avg_speed * 100) / 100}</td>
            </tr>            
        )
    }
}

function Table(props) {
	return (
		<table className="table table-hover">
			<thead>		
				<tr>
					<th scope="col">Date</th>
					<th scope="col">Time (minutes)</th>
					<th scope="col">Distance (km)</th>
					<th scope="col">Average speed (km/h)</th>
				</tr>
			</thead>
			<tbody>
				{props.list_sessions}  
			</tbody>
		</table>
		)
}

class Sessions_container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "data_sessions": null,
			"next_page": null,
			"data_laps": null,
			"show_table": true,
			"show_graph": "year",
        }
    }

    componentDidMount() {
        fetch(`${baseUrl}/app/api/sessions/`)
            .then(res=> res.json())
            .then(data => {
                console.log(data)
                this.setState({"data_sessions": data.results, "next_page": data.next});
				let table = document.querySelector("#table_container")
				const self = this
				table.onscroll = () => {
					if( (table.scrollTop === (table.scrollHeight - table.offsetHeight)) && self.state.next_page) {
						fetch(self.state.next_page)
							.then(res=> res.json())
							.then(data => {
								console.log(data)
								this.setState((state) => {return ({"data_sessions": state.data_sessions.concat(data.results), "next_page": data.next})});
							})
					}
				}
            })
					
		fetch(`${baseUrl}/app/api/laps/`)
            .then(res=> res.json())
            .then(data => {       
				data.forEach(x => x.timestamp = new Date(Date.parse(x.timestamp))) 
				console.log(data)
                this.setState({"data_laps": data});
				bar_plot(data, "#svg_year", "year", 400, 400)
				bar_plot(data, "#svg_month", "month", 400, 400)
            })
	}				

    render() {
        if (this.state.data_sessions) {
            var list_sessions = this.state.data_sessions.map((data) => Session_row(data));
        } else {
            var list_sessions = null;
        }
		
        return (
			<div>
				<div className="btn-group ml-3 mb-3" role="group" aria-label="Basic example">
				  <button type="button" className={this.state.show_graph === "year" ? "btn btn-primary active" : "btn btn-primary"} onClick={() => this.setState({"show_graph": "year"})}>Year</button>
				  <button type="button" className={this.state.show_graph === "month" ? "btn btn-primary active" : "btn btn-primary"} onClick={() => this.setState({"show_graph": "month"})}>Month</button>
				</div>
				
				<svg id="svg_year" display={this.state.show_graph === "year" ? "initial" : "none"}> </svg> 
				<svg id="svg_month" display={this.state.show_graph === "month" ? "initial" : "none"}> </svg>		
				
				<div id="table_container" className="container">
					{ this.state.show_table ? <Table list_sessions={list_sessions} /> : null}
				</div> 
			</div>
        )
    }
}

const domContainer = document.querySelector('#react_container');
ReactDOM.render(<Sessions_container />, domContainer);