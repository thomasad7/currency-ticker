import React from "react";
import DataTable from "react-data-table-component";
import "./App.css";

class App extends React.Component {

    // service apis
    apiDates = "http://localhost:3001/api/dates";
    apiRates = "http://localhost:3001/api/rates";

    // component state
    state = {
        dates: [],
        rates: null
    };

    // component startup
    componentDidMount() {
        // fetch dates into state
        fetch(this.apiDates)
        .then(response => response.json())
        .then(json => {
            this.setState({ dates: ['(Select Date)'].concat(json) });
        });
    }

    // component rendering
    render() {
        return (
            <div className="app">

                <h1>Currency Ticker</h1>

                {/* dates select */}
                <select name='select' onChange={this.handleSelect}>
                    {this.state.dates.map((date) => (
                        <option key={date} value={date}>{date}</option>
                    ))}
                </select>

                {/* rates table ( uses react-data-table-component see: https://www.npmjs.com/package/react-data-table-component )*/}
                {this.state.rates &&
                    <DataTable
                        columns={this.columns}
                        data={this.state.rates}
                    />
                }
                
            </div>
        );
    } 

    // select handler
    handleSelect = (select) => {
        let date = select.target.value;
        if (date === '(Select Date)') return;
        // fetch rates into state
        fetch(this.apiRates + "?date=" + date)
        .then(response => response.json())
        .then(json => {
            this.setState({rates: json});
        });
    }
    
    // table definition
    columns = [
        {
            name: 'Currency Pair',
            selector: row => row.pair,
            sortable: true
        },
        {
            name: 'Exchange Rate',
            selector: row => Number(parseFloat(row.current).toFixed(6)),
            sortable: true
        },
        {
            name: 'Daily Change %',
            selector: row => Number(parseFloat(row.change).toFixed(6)),
            sortable: true
        },
        {
            name: 'High/Low',
            selector: row => {
                if (row.minmax === -1) return 'LOWEST';
                if (row.minmax === 1) return 'HIGHEST';
            }
        },
    ];

}

export default App;
