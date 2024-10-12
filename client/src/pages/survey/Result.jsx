import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Result.css'; 

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [totalScore, setTotalScore] = useState(null);
    const [riskRating, setRiskRating] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const score = params.get('totalScore');
        const rating = params.get('riskRating');
        setTotalScore(score);
        setRiskRating(rating);
    }, [location.search]);

    return (
        <div className="result-container">
            <h1>Your Investment Risk Profile</h1>
            {totalScore && riskRating ? (
                <div className="result">
                    <p><strong>Total Score:</strong> {totalScore}</p>
                    <p><strong>Risk Rating:</strong> {riskRating}</p>
                </div>
            ) : (
                <p>Loading your result...</p>
            )}
            
            <div className="button-container">
               
                <button onClick={() => window.history.back()}>
                    Back
                </button>
                <button onClick={() => navigate(`/portfolio/${token}`)}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Result;