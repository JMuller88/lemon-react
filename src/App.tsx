import React from 'react';
import logo from './logo.svg';
import './App.scss';
import {Employees} from './Employees';
import {NewEmployee} from './NewEmployee';


function App() {
    return (
        <div className="App">
            <Employees></Employees>
            <NewEmployee/>
        </div>
    );
}

export default App;
