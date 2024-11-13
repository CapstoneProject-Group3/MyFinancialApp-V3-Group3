import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserSelection.css';

const FinancialProductSearchPage = () => {
    const [searchType, setSearchType] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const navigate = useNavigate();

    const productTypes = ["Stock", "Fund", "Cash&Equivalent"]; // Defined list of product types

    const handleSearch = async () => {
        try {
            const type = encodeURIComponent(searchType);
            const response = await fetch(`http://localhost:4000/api/financialProduct/queryByType?type=${type}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const productsWithChecked = data.data.map(product => ({
                    ...product,
                    isChecked: selectedProducts.some(p => p.id === product.id)
                }));
                setSearchResults(productsWithChecked);
            } else {
                throw new Error('Failed to fetch financial products');
            }
        } catch (error) {
            console.error('Error fetching financial products:', error.message);
        }
    };

    const handleCheckboxChange = (product) => {
        const isAlreadySelected = selectedProducts.some(p => p.id === product.id);
        if (isAlreadySelected) {
            setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
        } else {
            setSelectedProducts([...selectedProducts, product]);
        }
    };

    // Function to check if all types have been selected at least once
    const allTypesSelected = () => {
        const selectedTypes = new Set(selectedProducts.map(p => p.type));
        return productTypes.every(type => selectedTypes.has(type));
    };

    const generateRecommendations = () => {
        // Optionally, handle any logic needed before navigation, such as validation
        navigate('/recommendations', { state: { selectedProducts } });
    };

    return (
        <div>
            <div className="search-container">
                <h2>Search Financial Products by Type</h2>
                <div>
                    <select value={searchType} onChange={e => setSearchType(e.target.value)}>
                        <option value="">Select a Product Type</option>
                        {productTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <button onClick={handleSearch}>Search</button>
                </div>
            </div>

            <div className="search-results">
                <h3>Search Results</h3>
                <ul>
                    {searchResults.map((product) => (
                        <li key={product.id}>
                            <strong>Name:</strong> {product.name} <br />
                            <strong>Type:</strong> {product.type} <br />
                            <strong>Institution:</strong> {product.institution} <br />
                            <strong>Interest Rate:</strong> {product.interestRate} <br />
                            <strong>Description:</strong> {product.description} <br />
                            <strong>Risk Level:</strong> {product.riskLevel} <br />
                            <input
                                type="checkbox"
                                checked={selectedProducts.some(p => p.id === product.id)}
                                onChange={() => handleCheckboxChange(product)}
                            /> Select
                        </li>
                    ))}
                </ul>
                {allTypesSelected() && (
                    <button onClick={generateRecommendations}>Generate Recommendations</button>
                )}
                {!allTypesSelected() && (
                    <p>Please make sure to select at least one product from each type.</p>
                )}
            </div>
        </div>
    );
};

export default FinancialProductSearchPage;
