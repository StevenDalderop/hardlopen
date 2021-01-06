import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from '../components/navbar';
import Table from '../components/table';
import Bar_plot from '../components/barplot';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap'

const baseUrl = window.location.protocol + "//" +window.location.host

Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0 ? new Array(len).join(chr || '0')+this : this;
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

class App extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            "data_sessions": null,
			"next_page": null,
			"data_laps": null,
			"show_table": false,
			"show_graph": "year",
			"show_bar_plot": false,
			"theme": "light",
			"show": [],
        }
    }
	
	handleChange(e) {
		if (e.target.checked) {
			this.setState({"theme": "dark"})
			localStorage.setItem('theme', "dark");
		} else {
			this.setState({"theme": "light"})
			localStorage.setItem('theme', "light");
		}
	}
	
	show(name) {
		if (!this.state.show.includes(name)) this.setState(state => ({"show": [...state.show, name]}))
		else {
			this.setState(state => {
				const index = state.show.indexOf(name);
				var show = state.show
				show.splice(index, 1)
				if (index > -1) {
					return {"show": show}
				}
			})
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
		
        fetch(`${baseUrl}/api/sessions/`)
            .then(res=> res.json())
            .then(data => {
                this.setState({"data_sessions": data.results, "next_page": data.next, "show_table": true});
				let table = document.querySelector("#table_container")
				const self = this
				table.onscroll = () => {
					if( (table.scrollTop === (table.scrollHeight - table.offsetHeight)) && self.state.next_page) {
						fetch(self.state.next_page)
							.then(res=> res.json())
							.then(data => {
								this.setState((state) => {return ({"data_sessions": state.data_sessions.concat(data.results), "next_page": data.next})});
							})
					}
				}
            })
					
		fetch(`${baseUrl}/api/laps/`)
            .then(res=> res.json())
            .then(data => {       
				data.forEach(x => x.timestamp = new Date(Date.parse(x.timestamp))) 
                this.setState({"data_laps": data, "show_bar_plot": true});
            })
		
	}
	render() {		
		var btn_year_className = "btn"
		var btn_month_className = "btn"
		if (this.state.show_graph === "year") btn_year_className += " active"
		else if (this.state.show_graph === "month") btn_month_className += " active"
		if (this.state.theme === "dark") {btn_year_className += " btn-dark"; btn_month_className += " btn-dark"}
		else {btn_year_className += " btn-primary"; btn_month_className += " btn-primary"}
				
        return (
			<div className={this.state.theme}>
				<Navbar theme={this.state.theme} onChange={(e) => this.handleChange(e)} />
				<div id="content">
					<div id="div_buttons" className="btn-group mb-3" role="group" aria-label="Basic example">
					  <button type="button" className={btn_year_className} onClick={() => this.setState({"show_graph": "year"})}>Year</button>
					  <button type="button" className={btn_month_className} onClick={() => this.setState({"show_graph": "month"})}>Month</button>
					</div>			
					
											
					{ this.state.show_bar_plot && this.state.show_graph === "year" ? < Bar_plot data_input={this.state.data_laps} id_name={"svg_" + this.state.show_graph} 
						timeframe={this.state.show_graph} width={400} height={400} /> : null}
					{ this.state.show_bar_plot && this.state.show_graph === "month" ? < Bar_plot data_input={this.state.data_laps} id_name={"svg_" + this.state.show_graph} 
						timeframe={this.state.show_graph} width={400} height={400} /> : null}
					
					<div class="container">
					<div class="accordion mb-3 bg-light" id="accordionExample">
					  <div class="accordion-item">
						<h2 class="accordion-header" id="headingOne">
						  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
							Tips
						  </button>
						</h2>
						<div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
						  <div class="accordion-body">
							<div class="color-black">
								<ul>
									<li> Goed inlopen (~2km) en uitlopen (~1km) </li>
									<li> Halveer trainingen voor wedstrijd </li>
									<li> 1 training op bospad / helling, goed voor techniek en kracht </li>
									<li> Probeer ongeveer 180 passen per minuut aan te houden </li>
									<li> Af en toe korte versnelling van 50 a 200m </li>
									<li> Wisselduurloop rustig uitbouwen met 5 a 10 % per week </li>
								</ul>		
							</div>
						  </div>
						</div>
					  </div>
					  <div class="accordion-item">
						<h2 class="accordion-header" id="headingTwo">
						  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
							Tempos
						  </button>
						</h2>
						<div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
						  <div class="accordion-body">
							 <p class="color-black">
								De volgde tempotijden kun je ongeveer aanhouden afhankelijk van het aantal tempo’s en de 
								arbeid/rust verhouding en de vorm van de dag (gevoel). <br></br>

								2000 meter tempo’s :  10km wedstrijdtempo + 10 á 30 sec <br></br>

								1000 meter tempo’s : 10 km wedstrijdtempo + 0 á 15 sec <br></br>

								800m tempo’s: 10 km wedstrijdtempo -2 á  +10 sec <br></br>

								600m tempo’s: 10 km wedstrijdtempo  -5 á +5 sec <br></br>

								400 m tempo’s: 10 km wedstrijdtempo  - 1 á - 10sec <br></br>

								200m tempo’s: Hier is een trucje voor. Neem je 10 km tijd in minuten en maak 
								daar seconden van. Bv 45 minuten op 10 km wordt 45 sec op 200 m met een marge 
								van 2 sec meer of minder. <br></br>

								100 m tempo’s: iets harder dan de 200m <br></br>

								Duurloop:  10 km wedstrijdtempo + 30 á 60 sec <br></br>
								Grofweg bij 1km+ 2 min pauze, 100-400m 100/200 meter wandelen / joggen en 400m-1km 1.5 min pauze 
							</p>
						  </div>
						</div>
					  </div>
					</div>	
					</div>

						
					<div id="table_container" className="container table_container mb-5">
						{ this.state.show_table ?  <Table colnames={["Date", "Time", "Distance", "Average speed"]} rows={this.state.data_sessions.map((x) => Session_row(x))} theme={this.state.theme} /> : null}
					</div> 
				</div>
			</div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('react_container'));