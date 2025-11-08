import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

export default function Unauthorized() {
    const navigate = useNavigate();
    
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate(-1);
        }, 1000);
        return () => clearTimeout(timer);
    }, [navigate]); 

    return (
        <div>
            Unauthorized access - Redirecting back...
        </div>
    );
}