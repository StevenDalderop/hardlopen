import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from '../components/navbar';
import Training from '../components/training';

const baseUrl = window.location.protocol + "//" +window.location.host

function sortByKey(array, key) {
return array.sort(function(a, b) {
    var x = a[key]; var y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
});
}

export default class Schedule extends React.Component {
	constructor(props) {
		super(props)
		this.state = { "training_data": [], "theme": "light" } 
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
			.then(data => { console.log(data); this.setState({"training_data": data})})
	}
	
	handleChangeTraining(index) {
		this.setState(state => {
			var training_data = state.training_data
			var results = training_data.filter(x => x.index === index)
			var training = results[0]	
			if (training.completed) {
				training.completed = false 
			} else {
				training.completed = true
			}
			return {
				state,
				"training_data": training_data
			}
		})
	}
	
	renderTraining(t, training_nr) {
		return(
			< Training key={t.index} week={t.week} training_nr={training_nr} completed={t.completed} index={t.index}
			description={t.description} theme={this.state.theme} handleChangeTraining={() => this.handleChangeTraining(t.index)} />
		)
	}
	
	renderWeekTraining(week, trainings_week) {
		var trainings = sortByKey(trainings_week, "training_nr").map((t, training_nr) => this.renderTraining(t, training_nr + 1))	
		return (
			<div key={week} className="training-week">
				<h3> Week {week} </h3>
				<div className="div-training-week">
					{ trainings }
				</div>
			</div>
		)
	}		
	
	renderAllTraining(trainings_data) {
		var result = []
		var week_nr_max = 10
		for (var week_nr=1; week_nr<=week_nr_max; week_nr += 1) {
			var week_data = trainings_data.filter(x => x.week === week_nr)
			result.push(this.renderWeekTraining(week_nr, week_data))
		}
		return result 
	}
	
	render() {	
		var dataIsLoaded = this.state.training_data.length > 0		
		if (dataIsLoaded) {
			var bar_width = this.state.training_data.filter((x) => x.completed).length / this.state.training_data.length * 100
			var trainings = this.renderAllTraining(this.state.training_data)
		} else {
			var bar_width = 0
			var trainings = null
		}
		
		return (
			<div className={this.state.theme} >
				<Navbar theme={this.state.theme} onChange={(e) => this.handleChangeNav(e)} active="Schema" />
				<div id="content">
					<div className="container"> 
						<h1 className="center mb-4"> Schema </h1>
						<div className="progress">
							<div className="progress-bar" style={{width: bar_width + "%"}} 
							role="progressbar" aria-valuenow={bar_width} aria-valuemin="0" 
							aria-valuemax="100">{Math.round(bar_width) + "%"}</div>
						</div>
						<div id="trainings">
						  { trainings } 
						</div>
					</div>
				</div>
			</div>
		)
	}
}

