import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import './Employees.scss';
import axios from 'axios';
import {Link} from 'react-router-dom';

const dateFormat = require('dateformat');
const filter = require('lodash/filter');
const orderBy = require('lodash/orderBy');
const toString = require('lodash/toString');


interface IEmployee {
    id: number;
    fullname: string;
    _self: string;
    role_id: number;
    arrival_date: number;
}

interface IRole {
    id: number;
    label: string;
    checked: boolean;
}

interface ISorter {
    field: string | undefined;
    order: boolean;
}


export const Employees: React.FC = () => {
    const [employees, setEmployees] = useState<IEmployee[]>([]);
    const [filterName, setFilterName] = useState<string>('');
    const [roles, setRoles] = useState<IRole[]>([]);
    const [sorter, setSorter] = useState<ISorter>({
        field: "arrival_date",
        order: true
    })

    // filtering by name
    const handleFilterChange = (e: React.FormEvent<HTMLInputElement>) => {
        const {name, value}: any = e.target;
        setFilterName(value);
    }

    // filtering by role

    const [, updateState] = React.useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    const handleSelectRole = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const {name, value}: any = e.target;
        // look for the role
        const foundIndex = roles.findIndex(role => role.id == name);
        roles[foundIndex].checked = !roles[foundIndex].checked;
        setRoles(roles);
        // We force re-render
        forceUpdate();
    }

    // sort by date
    const handleSortToggle = (e: React.SyntheticEvent<HTMLDivElement>) => {
        const fieldName = e.currentTarget.dataset.sortfield;
        if (sorter.field == fieldName) {
            // Same filter, just toggle order
            setSorter({...sorter, order: !sorter.order});
            return;
        }
        // Different filter
        setSorter({field: fieldName, order: true});
    }

    // Load data from API
    useEffect(() => {
        axios.get(process.env.REACT_APP_API_URL + 'employees').then(datas => {
            setEmployees(datas.data.employees);
            setRoles(datas.data.roles.map((role: IRole) => {
                return {id: role.id, label: role.label, checked: false}
            }));
        });
    }, [])

    // Sorting employees when sorter's changed
    useEffect(() => {
        setEmployees(orderBy(employees, [sorter.field], [sorter.order ? "asc" : "desc"]));
    }, [sorter]);

    // filters employees by name and/or role
    const getFilteredEmployees: () => (IEmployee[]) = () => {
        let filteredEmployees = employees;

        // Apply name filtering
        if (filterName) {
            filteredEmployees = filter(filteredEmployees, (employee: IEmployee) => {
                return employee.fullname.toLowerCase().indexOf(filterName.toLowerCase()) !== -1;
            });
        }

        // Apply role filtering
        const rolesFiltering = filter(roles, {checked: true});
        if (rolesFiltering.length) {
            filteredEmployees = filter(filteredEmployees, (employee: IEmployee) => {
                    return (-1 !== rolesFiltering.findIndex((role: { id: number; }) => role.id == employee.role_id))
                }
            );
        }

        return filteredEmployees;
    }

    const Employee: React.FC<IEmployee> = (employee: IEmployee) => {
        return (
            <Link to={'/employee/' + employee.id} className="employee-container">
                <div
                    key={employee.id}
                    data-employee_id={employee.id}>
                    <div className="employee-fullname">{employee.fullname}</div>
                    <div className="employee-role">{getRole(employee.role_id)}</div>
                    <div className="employee-arrival_date">
                        {dateFormat(employee.arrival_date * 1000, 'dd/mm/yyyy')}
                    </div>
                </div>
            </Link>
        );
    }

    const getRole: (roleId: number) => (string | { filteredRole: any }) = (roleId: number) => {
        const filteredRole = filter(roles, {id: roleId});
        if (!roles.length) {
            return "-";
        }

        return filteredRole[0].label;
    }

    return (
        <div>
            <div id="Employees-container">
                <h2>Membres de l'équipe</h2>
                <div className="filters-container">
                    Rechercher une personne : <input name="name" value={filterName} onChange={handleFilterChange}/>
                    <hr/>
                    Filter par fonction<br/>
                    <div className="filters-roles-container">
                        {roles.map(role =>
                            <div key={role.id}><input type="checkbox" data-role_id={role.id}
                                                      name={toString(role.id)}
                                                      checked={role.checked}
                                                      onChange={handleSelectRole}/>{role.label}
                            </div>
                        )}
                    </div>
                </div>

                <br/>
                {!getFilteredEmployees().length && <div>Aucun résutat pour {filterName}</div>}

                <div className="help">
                    Il suffit de cliquer sur une ligne pour afficher les détails de la personne.<br/>
                    Le tri sur le role n'est pas effectif. Pour trier par date d'arrivée, il suffit de cliquer sur
                    l'entête de la colonne.
                </div>
                <hr/>
                <div className="employee-wrapper">
                    <div className="employee-container header">
                        <div className="employee-fullname">Prénom Nom</div>
                        <div className="employee-role">Fonction</div>
                        <div
                            className="employee-arrival_date"
                            data-sortfield="arrival_date"
                            onClick={handleSortToggle}>
                            Date d'arrivée (click 2 sort)
                        </div>
                    </div>
                    {
                        getFilteredEmployees()
                            .map(employe =>
                                <Employee {...employe} key={employe.id}/>
                            )
                    }
                </div>
                <div className="help">Il pourrait être sympa et utile de prévoir une pagination pour le futur...</div>
            </div>
        </div>
    );

}