import React, { useState } from 'react';
import './homepage.css'
const HomePage = () => {
    const [formdata, setFormData] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`URL to shorten: ${formdata}`);
    }

    const onChange = (e) =>{
        setFormData(e.target.value);
    }
    
  return (
    <div>
        <h1>Welcome to URL Shortner App</h1>
        <div className='form-container'>
            <form className="form-field" onSubmit={handleSubmit}>
                <input className='input-text' 
                        type="text" 
                        value={formdata}
                        onChange={onChange}
                        placeholder='Enter your URL here' />
                <button className='submit-btn'>Short Url</button>
            </form>
        </div>
    </div>
  )
}

export default HomePage
