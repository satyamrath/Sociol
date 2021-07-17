import React from 'react'
import { useHistory } from 'react-router-dom';

export default function Redirection() {

    const history = useHistory();
    history.push('/');

    return (
        <>
        </>
    )
}
