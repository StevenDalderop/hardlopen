import React from 'react';
import ReactDOM from 'react-dom';
import NavbarSmall from '../components/navbar_small';
import LoginForm from '../components/loginform';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap'

class App extends React.Component {
  render () {
    return (
      <div>
	    <NavbarSmall />
		<LoginForm />
      </div>
    )
  }
}
ReactDOM.render(<App />, document.getElementById('react_container'));