import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const RecommendationsPage = () => {
    const location = useLocation();
    const { selectedProducts } = location.state;
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const generateRecommendations = async () => {
            try {
                const response = await axios.post('http://localhost:4000/api/recommendations/generate', { selectedProducts },{
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setRecommendations(response.data.data);
            } catch (error) {
                console.error('Failed to generate recommendations:', error);
            }
        };

        generateRecommendations();
    }, []);

    return (
        <div>
            <h2>Recommended Financial Products</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Institution</th>
                        <th>Interest Rate</th>
                        <th>Description</th>
                        <th>Risk Level</th>
                        <th>Investment Proportion</th>
                    </tr>
                </thead>
                <tbody>
                    {recommendations.map(rec => (
                        <tr key={rec.productId}>
                            <td>{rec.name}</td>
                            <td>{rec.type}</td>
                            <td>{rec.institution}</td>
                            <td>{rec.interestRate}</td>
                            <td>{rec.description}</td>
                            <td>{rec.riskLevel}</td>
                            <td>{`${rec.investmentProportion}%`}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RecommendationsPage;
