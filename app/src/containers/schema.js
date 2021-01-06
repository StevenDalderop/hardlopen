import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from '../components/navbar';
import Training from '../components/training';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap'

const baseUrl = window.location.protocol + "//" +window.location.host

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = { "checked": [], "theme": "light" } 
		
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
		
		fetch(`${baseUrl}/api/training`)
			.then(res => res.json())
			.then(data => this.setState({"checked": data}))
	}
	
	handleChangeTraining(id, isChecked) {
		if (!isChecked) this.setState(state => ({"checked": [...state.checked, {"training_id": id}]}))
		else { 
			this.setState(state => {
				var checked = state.checked.filter((x) => x.training_id !== id)				
				return {"checked": checked}
			})
		}
	}
	
	renderTraining(id, training) {
		return(
			< Training id={id} checked={this.state.checked} handleChangeTraining={(id,isChecked) => this.handleChangeTraining(id, isChecked)} 
				training_number={id % 3 ? id % 3 : 3} training={training} theme={this.state.theme} />
		)
	}
	
	renderWeekTraining(week, trainings) {
		return (
			<div className="training-week">
				<h3> Week {week} </h3>
				<div className="text-left">
					{ this.renderTraining(3 * week - 2, trainings[0]) } 
					{ this.renderTraining(3 * week - 1, trainings[1]) }
					{ this.renderTraining(3 * week, trainings[2]) }
				</div>
			</div>
		)
	}		
	
	render() {
		var className = "bg_no_success"
		if (this.state.theme === "dark") className = "bg_no_success_dark"
		return (
		<div className={this.state.theme} >
			<Navbar theme={this.state.theme} onChange={(e) => this.handleChangeNav(e)} />
			<div id="content">
				<div className="container"> 
					<h1 className="center mb-4"> Schema </h1>
					<div class="progress">
						<div class="progress-bar" style={{width: this.state.checked.length / 30 * 100 + "%"}} 
						role="progressbar" aria-valuenow={this.state.checked.length / 30 * 100} aria-valuemin="0" 
						aria-valuemax="100">{Math.round(this.state.checked.length / 30 * 100) + "%"}</div>
					</div>
					<div id="trainings">
						{ this.renderWeekTraining(1, ["5 x 1000m", "8 x 500m", "5-10km"]) }
						{ this.renderWeekTraining(2, ["15 x 200m", "5 x 1000m", "5-10km"]) }
						{ this.renderWeekTraining(3, ["10 x 400m", "6 x 800m", "6-12km"]) }
						{ this.renderWeekTraining(4, ["5 x 300m", "3 x 800m", "Test westrijd 10km"]) }
						{ this.renderWeekTraining(5, ["5 x 1000m + 4 x 200m", "5 x (800 + 200m)", "8km"]) }
						{ this.renderWeekTraining(6, ["10km bos + 10 x 100 a 200m", "12 x 500m", "9km"]) }
						{ this.renderWeekTraining(7, ["3 x 2000m + 4 x 100m", "15 x 200m", "9km"]) }
						{ this.renderWeekTraining(8, ["6 a 7 x 1000m", "10 x 400m", "10km"]) }
						{ this.renderWeekTraining(9, ["7 a 8 x 1000m", "15 x 200m", "11km"]) }
						{ this.renderWeekTraining(10, ["8 a 9 x 1000m", "5 x (800 + 200m)", "Test wedstrijd 10km"]) }
					</div>
				</div>
			</div>
		</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('react_container'));