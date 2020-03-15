import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import {useDropzone} from 'react-dropzone'
import DatePicker, { Day } from 'react-modern-calendar-datepicker'
import padStart from 'lodash/padStart';
import toString from 'lodash/toString';
import Select, {OptionTypeBase} from 'react-select';
import './NewEmployee.scss';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';


interface IEmployee {
    firstname: string;
    lastname: string;
    job_title: string;
    email: string;
    phone: string;
    role: OptionTypeBase;
}

interface Role {
    id: number,
    label: string
}

export const NewEmployee: React.FC = () => {
    // Store user datas
    const initState = {
        firstname: '',
        lastname: '',
        job_title: '',
        email: '',
        phone: '',
        role: {}
    };

    const [state, setState] = useState<IEmployee>(initState);
    // Store avatar
    const [avatar, setAvatar] = useState<any>(null);
    // Store date
    const today = {
        day: new Date().getDate(),
        month: new Date().getMonth()+1,
        year: new Date().getFullYear()
    }
    // Store Day
    const [day, setDay] = React.useState<Day>(today);
    // Store roles from API
    const [roles, setRoles] = React.useState<Role[]>([]);
    // Remap for select input
    const options = roles.map(role => ({label:role.label, value:role.id}));

    // Update state with form's data
    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        const {name, value}: any = e.target;

        if (null !== state) {
            setState({...state, [name]: value});
        }
    }
    // Update select role_id
    const handleSelectClick = (e: OptionTypeBase) => {
        setState({...state, role:e});
    }

    // Send request, after click button
    const handleSubmitForm = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        sendRequest();
    }

    function sendRequest() {
        // checking args
        if (null === avatar) {
            alert('Vous devez choisir un avatar');
            return;
        }

        // making request's args
        const arrival_date = day.year+'-'
            +padStart(toString(day.month), 2, '0')+'-'
            +padStart(toString(day.day), 2, '0');

        const formData = new FormData();

        formData.append("avatar", avatar, avatar.name);
        formData.append('firstname', state.firstname);
        formData.append('lastname', state.lastname);
        formData.append('arrival_date', arrival_date);
        formData.append('job_title', state.job_title);
        formData.append('email', state.email);
        formData.append('phone', state.phone);
        formData.append('role_id', state.role.value);

        axios.post(
            "http://lemon-employees.com/api/employee",
            formData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        )
            .then(datas => {
                // Todo : replace with switch
                // Maybe use flash messages for informations
                if (datas.status == 201) // User created
                {
                    // init form
                    setState(initState);
                    alert("L'utilisateur a bien été créé");
                }
            })

        return;
    }

    // Dropzone package
    const MyDropzone: React.FC = () => {
        const onDrop = useCallback(acceptedFiles => {
            // sendRequest(acceptedFiles[0]);
            setAvatar(acceptedFiles[0]);
            // Todo : check if sizeof avatar is not > 2Mo
        }, [])

        const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

        return (
            <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Déposez ici l'avatar</p> :
                        <p>Déposez ici l'avatar ou cliquez pour sélectionner un fichier</p>
                }
            </div>
        )
    }

    // loading datas from API
    useEffect(() => {
        axios.get('http://lemon-employees.com/api/roles')
            .then(datas => {
                setRoles(datas.data.roles);
            })
    }, []);


    return (
        <div id="new_employee">
            <h2>Ajout d'une personne à l'équipe</h2>
            <div className="help">
                To be continued... La requête est lancée lorsque l'image est déposée ou choisie...<br/>
                Oui, je sais, c'est stupide ... Mais manque de temps... Le choix du rôle en liste déroulante reste
                également à faire.
            </div>

            <div>
                <label>Prénom</label> <input type="text" name="firstname" value={state.firstname}
                                             onChange={handleChange}/><br/>
                <label>Nom</label> <input type="text" name="lastname" value={state.lastname}
                                          onChange={handleChange}/><br/>
                <label>job_title</label>
                <input type="text" name="job_title" value={state.job_title} onChange={handleChange}/><br/>
                <label>email</label>
                <input type="text" name="email" value={state.email} onChange={handleChange}/><br/>
                <label>phone</label>
                <input type="text" name="phone" value={state.phone} onChange={handleChange}/><br/>
                <label>arrival_date</label>
                <DatePicker value={day} onChange={setDay} />
                <label>role</label>

                <Select value={state.role}
                        onChange={handleSelectClick}
                        options={options}
                />

                <MyDropzone/>
            </div>
            <hr/>
            <button onClick={handleSubmitForm}>Valider</button>
        </div>
    );
}