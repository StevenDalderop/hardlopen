import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import NavbarSmall from '../components/navbar_small';
import LoginForm from '../components/loginform';
import { useDarkMode } from '../components/use_dark_mode';

function App() {
  const [theme, toggleTheme] = useDarkMode()
	
  return (
    <div className={theme}>
	    <NavbarSmall theme={theme} onChange={toggleTheme} />
		  <LoginForm />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('react_container'));