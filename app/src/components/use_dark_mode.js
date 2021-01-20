import React, { useEffect, useState } from "react"

export const useDarkMode = () => {
	const [theme, setTheme] = useState("light")
	
	useEffect(() => { 
		const theme = window.localStorage.getItem('theme');	
    if (theme === "dark") {
      document.body.style.backgroundColor = "rgb(50,50,50)"
    } else {
      document.body.style.backgroundColor = "white"
    }
    theme && setTheme(theme);}, [theme])	
	
	const toggleTheme = () => {
	  if (theme === 'light') {
        window.localStorage.setItem('theme', 'dark');
        setTheme('dark');
      } else {
        window.localStorage.setItem('theme', 'light');
        setTheme('light');
      }
	}
	
	return [theme, toggleTheme]
}