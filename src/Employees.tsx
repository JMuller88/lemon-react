import * as React from "react";
import {useEffect, useState} from "react";
import './Employees.scss';
import {EmployeePreview} from './EmployeePreview';
import axios from 'axios';

const dateFormat = require('dateformat');
const filter = require('lodash/filter');
const orderBy = require('lodash/orderBy');
const toInteger = require('lodash/toInteger');


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
    const [employeePreviewId, setEmployeePreviewId] = useState<number | null>(null);

    const handleFilterChange = (e: React.FormEvent<HTMLInputElement>) => {
        const {name, value}: any = e.target;
        setFilterName(value);
    }

    const handleSelectRole = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const {name, value}: any = e.target;
        // To be continued...
    }

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

    const handleEmployeePreview = (e: React.SyntheticEvent<HTMLDivElement>) => {
        const employeeID = undefined !== e.currentTarget.dataset.employee_id ? toInteger(e.currentTarget.dataset.employee_id) : null;
        setEmployeePreviewId(employeeID);
    }

    useEffect( () => {
        axios.get('http://lemon-employees.com/api/employees').then(datas => {
            setEmployees(datas.data.employees);
            setRoles(datas.data.roles);
        });
    }, [])

    // Sorting employees when sorter's changed
    useEffect(() => {
        setEmployees(orderBy(employees, [sorter.field], [sorter.order ? "asc" : "desc"]));
    }, [sorter]);


    const getFilteredEmployees: () => (IEmployee[]) = () => {
        if (!filterName) {
            return employees;
        }

        return filter(employees, (employee: IEmployee) => {
            return employee.fullname.toLowerCase().indexOf(filterName.toLowerCase()) !== -1;
        });
    }

    const Employee: React.FC<IEmployee> = (employee: IEmployee) => {
        return (
            <div
                className={employee.id == employeePreviewId ? "employee-container employee-selected" : "employee-container"}
                key={employee.id}
                data-employee_id={employee.id}
                onClick={handleEmployeePreview}>
                <div className="employee-fullname">{employee.fullname}</div>
                <div className="employee-role">{getRole(employee.role_id)}</div>
                <div className="employee-arrival_date">
                    {dateFormat(employee.arrival_date * 1000, 'dd/mm/yyyy')}
                </div>
            </div>
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
                    Filter par fonction <div className="help"> (To be continued...)</div><br/>
                    <div className="filters-roles-container">
                        {roles.map(role =>
                            <div><input type="checkbox" data-role_id={role.id}
                                        onChange={handleSelectRole}/>{role.label}</div>
                        )}
                    </div>
                </div>

                <br/>
                {!getFilteredEmployees().length && <div>Aucun résutat pour {filterName}</div>}

                <div className="help">
                    Il suffit de cliquer sur une ligne pour afficher les détails de la personne.<br/>
                    Le tri sur le role n'est pas effectif. Pour trier par date d'arrivée, il suffit de cliquer sur l'entête de la colonne.
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
                    {getFilteredEmployees().map(employe => <Employee {...employe} key={employe.id}/>)}
                </div>
                <div className="help">Il pourrait être sympa et utile de prévoir une pagination pour le futur... </div>
            </div>
            <div id="Employee-preview-container">
                <EmployeePreview employeeIdProps={employeePreviewId}/>
            </div>
        </div>
    );

}