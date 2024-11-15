import React, { useState } from 'react';
import axios from 'axios';

function FinancialProductImport() {
  const [file, setFile] = useState(null);
  document.title = 'Product Import';
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:4000/api/financialProduct/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully: ' + response.data.message);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('File upload failed: ' + error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <h2>Import Financial Products from Excel</h2>
      <form>
        <div>
          <label htmlFor="fileUpload">Upload Excel File:</label>
          <input
            type="file"
            id="fileUpload"
            onChange={handleFileChange}
            accept=".xlsx, .xls"
          />
        </div>
        <button type="button" onClick={handleFileUpload}>
          Upload File
        </button>
      </form>
    </div>
  );
}

export default FinancialProductImport;