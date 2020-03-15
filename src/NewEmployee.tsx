import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import {useDropzone} from 'react-dropzone'
import './NewEmployee.scss';

interface IEmployee {
    firstname: string;
    lastname: string;
    job_title: string;
    email: string;
    phone: string;
    arrival_date: string;
    role_id: string;
}

export const NewEmployee: React.FC = () => {
    // Store avatar
    const [avatar, setAvatar] = useState<any>(null);
    // Update state with form's data
    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        const {name, value}: any = e.target;

        if (null !== state) {
            setState({...state, [name]: value});
        }
    }

    const handleSubmitForm = (e: React.FormEvent<HTMLButtonElement>) => {
        console.log('button clicked');
        e.preventDefault();
        sendRequest();
    }

    // To many properties to use one hook for each properties
    const [state, setState] = useState<IEmployee>({
        firstname: '',
        lastname: '',
        job_title: '',
        email: '',
        phone: '',
        arrival_date: '',
        role_id: ''
    });

    function sendRequest() {
        // checking args
        if (null === avatar) {
            alert('Vous devez choisir un avatar');
            return;
        }

        // making request's args
        const formData = new FormData();
        formData.append("avatar", avatar, avatar.name);
        formData.append('firstname', state.firstname);
        formData.append('lastname', state.lastname);
        formData.append('arrival_date', state.arrival_date);
        formData.append('job_title', state.job_title);
        formData.append('email', state.email);
        formData.append('phone', state.phone);
        formData.append('role_id', state.role_id);

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
                console.log(datas);
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

    return (
        <div id="new_employee">
            <h2>Ajout d'une personne à l'équipe</h2>
            <div className="help">
                To be continued... La requête est lancée lorsque l'image est déposée ou choisie...<br/>
                Oui, je sais, c'est stupide ... Mais manque de temps... Le choix du rôle en liste déroulante reste
                également à faire.
            </div>

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
            <input type="text" name="arrival_date" value={state.arrival_date} onChange={handleChange}/><br/>
            <label>role</label>
            <input type="text" name="role_id" value={state.role_id} onChange={handleChange}/><br/>
            <button onClick={handleSubmitForm}>Valider</button>

            <MyDropzone/>
        </div>
    );
}