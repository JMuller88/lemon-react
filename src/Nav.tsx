import React from 'react';
import {Link} from 'react-router-dom';

export const Nav: React.FC = () => {
    return (
        <nav>
            <ul className="nav-links">
                <Link to="/employees">
                    <li>Liste des employés</li>
                </Link>

                <Link to="/employee/new">
                    <li>Ajouter un employé</li>
                </Link>
            </ul>
        </nav>
    )
}