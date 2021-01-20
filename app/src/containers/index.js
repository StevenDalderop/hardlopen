import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from '../components/navbar';
import Bar_plot from '../components/barplot';

const baseUrl = window.location.protocol + "//" + window.location.host

export default class Index extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
			"data_laps": null,
			"show_bar_plot": false,
			"theme": "light",
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

    componentDidMount() {
		if (!localStorage.getItem('theme')) {
			localStorage.setItem('theme', "light");
		}
		
		let theme = localStorage.getItem('theme');
		this.setState({"theme": theme}) 
						
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
		
		if (this.state.theme === "dark") { 
			document.body.style.backgroundColor = 'rgb(' + 50 + ',' + 50 + ','+ 50 + ')';
			document.body.style.color = 'white';
		} else {
			document.body.style.backgroundColor = 'white';
			document.body.style.color = 'black';
		}
				
        return (
			<div className={this.state.theme}>
				<Navbar theme={this.state.theme} onChange={(e) => this.handleChange(e)} active="Home" />
				<div id="content">	
					<div className="container">
						<div className="row text-center">
							<div className="col-sm">
								{ this.state.show_bar_plot ? 
								< Bar_plot data_input={this.state.data_laps} id_name="svg_year" 
								timeframe="year" width={400} height={400} /> : 
								<div className={"loader bg-" + this.state.theme}> </div>}	
							</div>
							<div className="col-sm">
								{ this.state.show_bar_plot ? < Bar_plot data_input={this.state.data_laps} id_name="svg_month"
								timeframe="month" width={400} height={400} /> : <div className={"loader bg-" + this.state.theme}> </div>}
							</div>
						</div>
						<div className="row">
							<div className="col-lg">
								<h3> Tips </h3>
								<ul>
									<li> Goed inlopen (~2km) en uitlopen (~1km) </li>
									<li> Halveer trainingen voor wedstrijd </li>
									<li> 1 training op bospad / helling, goed voor techniek en kracht </li>
									<li> Probeer ongeveer 180 passen per minuut aan te houden </li>
									<li> Af en toe korte versnelling van 50 a 200m </li>
									<li> Wisselduurloop rustig uitbouwen met 5 a 10 % per week </li>
								</ul>
							</div>
							<div className="col-lg">
								<h3> Tempos </h3>
								<p>
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
        )
    }
}