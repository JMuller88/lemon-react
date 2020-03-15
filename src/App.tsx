import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.scss';
import {Employees} from './Employees';
import {NewEmployee} from './NewEmployee';
import {EmployeePreview} from "./EmployeePreview";
import {Nav} from './Nav';


function App() {
    return (
        <div>
            <Router>
                <div className="App">
                    <Nav/>
                    <div className="app-wrapper">
                        <Switch>
                            <Route path={["/", "/employees"]} exact component={Employees}/>
                            <Route path="/employee/new" exact component={NewEmployee}/>
                            <Route path="/employee/:id" exact component={EmployeePreview}/>
                        </Switch>
                    </div>
                </div>
            </Router>
        </div>
    );
}

export default App;
