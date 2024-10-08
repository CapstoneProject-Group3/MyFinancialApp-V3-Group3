import React, { useState } from 'react';
import './Questionaire.css';

const Questionaire = () => {
    const [formData, setFormData] = useState({
        Q2: '',
        Q3: '',
        Q4: '',
        Q5: '',
        Q6: '',
        Q7: '',
        Q8: '',
        Q9: '',
        Q10: '',
        Q11: '',
        Q12: '',
        Q13: '',
        Q14: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = Object.entries(formData).map(([key, value]) => ({ key, value }));
        console.log('Form data: ', data);

        fetch('http://localhost:3001/submit-quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((rep) => {
                console.log('rep:', rep.totalScore);
                window.location.href = `/result.html?number=${rep.totalScore}`;
            });
    };

    return (
        <div className="container">
            <h3 className="p3">What kind of Investor are you?</h3>
            <p className="text">
                Before you invest, it’s important to understand what kind of investor you are, which means knowing your willingness and ability to accept risk, your investment time horizon, and your objectives. Answering these questions will best help us understand your current situation.
            </p>
            <p className="hint">
                Hint: Only the final risk tolerant level will be stored in your profile. You do not have to worry about the data leak of your choices to each of the questions.
            </p>

            <form id="quizForm" onSubmit={handleSubmit}>
                <div className="questionGroup">
                    <p className="p1">Question 1: Which statement best describes your knowledge of investments?</p>
                    <label><input type="radio" name="Q2" value="A" required onChange={handleChange} /> A. I have very little knowledge of investments.</label>
                    <label><input type="radio" name="Q2" value="B" onChange={handleChange} /> B. I have a moderate level of knowledge.</label>
                    <label><input type="radio" name="Q2" value="C" onChange={handleChange} /> C. I have extensive knowledge and follow financial markets closely.</label>
                </div>
                
                <div className="questionGroup">
                    <p className="p1">Question 2: What is your annual income (from all sources)?</p>
                    <label><input type="radio" name="Q3" value="A" required onChange={handleChange} /> A. Less than $25,000 (0 points)</label>
                    <label><input type="radio" name="Q3" value="B" onChange={handleChange} /> B. $25,000 – $49,999 (2 points)</label>
                    <label><input type="radio" name="Q3" value="C" onChange={handleChange} /> C. $50,000 – $74,999 (4 points)</label>
                    <label><input type="radio" name="Q3" value="D" onChange={handleChange} /> D. $75,000 – $99,999 (5 points)</label>
                    <label><input type="radio" name="Q3" value="E" onChange={handleChange} /> E. $100,000 – $199,999 (7 points)</label>
                    <label><input type="radio" name="Q3" value="F" onChange={handleChange} /> F. $200,000 or more (10 points)</label>
                </div>

                {/* Continue creating divs for other questions similar to the ones above */}
                
                <button type="submit" className="button">Submit</button>
            </form>

            <p id="result"></p>
        </div>
    );
};

export default Questionaire;