import * as React from "react";
import {useEffect, useState} from "react";
import './EmployeePreview.scss';
import axios from 'axios';
const dateFormat = require('dateformat');

interface IEmployee {
    id: number;
    firstname: string;
    lastname: string;
    job_title: string;
    email: string;
    phone: string;
    avatar: string;
    arrival_date: number;
    role_id: number;
    avatar_url: string;
    role: {
        id: number;
        label: string;
    }
}

interface IProps {
    employeeIdProps: number | null;
}

export const EmployeePreview: React.FC<IProps> = (props) => {
    // employeeId : current shown user id
    const [employeeId, setEmployeeId] = useState<number | null>(props.employeeIdProps);
    // employee : current shown user
    const [employee, setEmployee] = useState<IEmployee | null>(null);

    // Update state with props, this will fire the next useEffect
    useEffect(() => {
        setEmployeeId(props.employeeIdProps);
    }, [props]);

    useEffect(() => {
        if (!employeeId) {
            // No employeeId : no request
            return;
        }

        axios.get('http://lemon-employees.com/api/employee/' + employeeId)
            .then(datas => {
                setEmployee(datas.data.employee);
            })

    }, [employeeId]);

    return (
        employee &&
        <div id="employee_preview">
            <h2>Visualisation d'un membre de l'équipe</h2>
            <div className="help">Les SVG ne s'affichent pas, visiblement un problème de mimetype, le back retourne un text/utf-8 dans les headers pour les .svg. Fonctionne bien après l'upload d'un jpeg ou png.</div>
            <div className="avatar"><img src={employee.avatar_url}/></div>
            <div className="attributes_container">
                <div>{employee.lastname} {employee.firstname}</div>
                <div>{employee.job_title}</div>
                <div>{employee.email}</div>
                <div>{employee.phone}</div>
                <div>{dateFormat(employee.arrival_date, 'dd/mm/yyyy')}</div>
                <div>{employee.role.label}</div>
            </div>

        </div>
    );

}