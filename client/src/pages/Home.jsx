import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const Home = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasToken, setHasToken] = useState(false);
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = jwtDecode(token);
                setUserId(decoded.id);
                setIsAuthenticated(true);
                setHasToken(true);
            } else {
                setHasToken(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setHasToken(false);
        setUserId(null);
    };

    const buttonStyle = {
        display: 'inline-block',
        padding: '10px 20px',
        margin: '5px',
        backgroundColor: '#007bff',
        color: 'white',
        textAlign: 'center',
        border: 'none',
        borderRadius: '5px',
        textDecoration: 'none',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer'
    };

    const goToResultsPage = async () => {
        const riskData = await fetchRiskLevel();
        if (riskData) {
            navigate(`/result?totalScore=${riskData.totalScore}&riskRating=${riskData.riskLevel}`);
        } else {
            alert("No risk data available. Please complete the assessment.");
        }
    };

    const fetchRiskLevel = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log("No token available");
            return;
        }

        try {
            const response = await axios.get('http://localhost:4000/api/questionnaire/risk-level', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching risk info:", error);
        }
    };

    const goToPortfolio = async () => {
        const riskRating = await fetchRiskLevel();
        if (riskRating) {
            navigate(`/portfolio?riskRating=${riskRating.riskLevel}`);
        } else {
            alert("Risk rating is not available. Please complete the necessary steps.");
        }
    };


    if (!hasToken) {
        return (
            <div>
                <div>You are not logged in.</div>
                <Link to="/login" style={buttonStyle}>Login</Link>
                <Link to="/register" style={buttonStyle}>Register</Link>
            </div>
        );
    }

    //if admin
    if (userId === 3) {
        return (
            <div>
                <h1>Welcome, Admin!</h1>
                <p>You are logged in as an admin.</p>
                <button onClick={() => navigate("/financialProductForm")} style={buttonStyle}>Manage Financial
                    Products
                </button>
                <button onClick={() => navigate("/financialProductSearch")} style={buttonStyle}>Search Financial
                    Products
                </button>
                <button onClick={() => navigate("/financialProductImport")} style={buttonStyle}>Import Financial
                    Products
                </button>
                <button onClick={handleLogout} style={buttonStyle}>Logout</button>
            </div>
        );
    }

    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <p>You are authenticated and can view this content.</p>
            <button onClick={handleLogout} style={buttonStyle}>Logout</button>
            <br/>
            <p>Access our survey.</p>
            <Link to="/questionaire" style={buttonStyle}>Start Survey</Link>
            <button onClick={goToResultsPage} style={buttonStyle}>View Result</button>
            <button onClick={goToPortfolio} style={buttonStyle}>Go to Portfolio</button>
        </div>
    );
};

export default Home;
