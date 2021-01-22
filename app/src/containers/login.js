import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import NavbarSmall from '../components/navbar_small';
import LoginForm from '../components/loginform';
import { useDarkMode } from '../components/use_dark_mode';

function App() {
  const [theme, toggleTheme] = useDarkMode()
  var isDarkTheme = theme === "dark"
  var className = isDarkTheme ? "dark" : "primary"

  if (context.message) {
    var message = <div className={"alert alert-dismissible fade show alert-" + className } role="alert">
    {context.message}
    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
  } else {
    var message = null
  }
	
  return (
    <div className={theme}>
      <NavbarSmall theme={theme} onChange={toggleTheme} />
      { message }	
      <div className="center-vertical">
        <LoginForm theme={theme} />
      </div>    
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('react_container'));