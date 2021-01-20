import React from 'react';

const Table = ({colnames, rows, theme}) => {
	var thead_class = "thead-light"
	if (theme === "dark") thead_class = "thead-dark"
	
	var table_class = "table table-hover"
	if (theme === "dark") table_class += " table-dark"
	else if (theme === "light") table_class += " table-light"

	return (
		<table className={table_class}>
			<thead className={thead_class}>		
				<tr>
				    { colnames.map((name, index) => <th scope="col" key={index.toString()}> {name} </th>)}
				</tr>
			</thead>
			<tbody>
				{ rows }  
			</tbody>
		</table>
	)
}
export default Table;