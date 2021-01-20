import React from 'react'
import Navbar from '../components/navbar'
import { useDarkMode } from '../components/use_dark_mode';
import { useState, useEffect } from 'react'
import Table from '../components/table';
import { getFormattedDateTime, getMinutePerKm, getFormattedTime, getFormattedDistance } from '../util'

const baseUrl = window.location.protocol + "//" + window.location.host

function Session_row(props) {
    if (props == null) { 
        return null
    } else {
		var formatted_speed = props.settings === "min/km" ? getMinutePerKm(props.data.avg_speed) + " min/km" : Math.round(props.data.avg_speed * 100) / 100 + " km/h"
        return (
            <tr>
				<td><a href={"session/" + props.index}>{getFormattedDateTime(props.data.timestamp)}</a></td>
				<td>{getFormattedTime(props.data.total_elapsed_time)}</td>
				<td>{getFormattedDistance(props.data.total_distance) + " km"}</td>
				<td>{formatted_speed}</td>
            </tr>            
        )
    }
}

export default function Trainingen() {
    const [theme, toggleTheme] = useDarkMode()
    const [sessionData, setSessionData] = useState(null)
    const [nextPage, setNextPage] = useState(null)
    const [showTable, setShowTable] = useState(false)

    useEffect(() => {
        fetch(`${baseUrl}/api/sessions/`)
            .then(res=> res.json())
            .then(data => {
                setSessionData(data.results)
                setNextPage(data.next)
                setShowTable(true)
        })
    },[]);

    useEffect(() => {
        let table = document.querySelector("#table_container")

        table.onscroll = () => {
            if((table.scrollTop === (table.scrollHeight - table.offsetHeight)) && nextPage) {
                fetch(nextPage)
                    .then(res => res.json())
                    .then(data => {
                        setSessionData(sessionData.concat(data.results))
                        setNextPage(data.next)
                    })
                console.log("fetch")
            }
        }
    })

    return (
        <div className={theme}>
            <Navbar theme={theme} onChange={toggleTheme} active="Trainingen" />
            <div id="content">
                <div id="table_container" className="container table_container mb-5">
                    { showTable ?  <Table colnames={["Date", "Time", "Distance", "Average speed"]} 
                    rows={sessionData.map((x) => < Session_row data={x} settings="min/km" key={x.index} />)} theme={theme} /> : null}
                </div> 
            </div>
        </div>
    )
}