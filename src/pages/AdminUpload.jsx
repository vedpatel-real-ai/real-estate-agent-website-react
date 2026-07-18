// src/pages/AdminUpload.jsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Make sure supabaseClient.js is correctly set up

const AdminUpload = () => {
  const [propertyData, setPropertyData] = useState({
    name: '',
    description: '',
    location: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setPropertyData({ ...propertyData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setSuccessMsg('');

    try {
      // 1. Upload image to Supabase Storage
      const imageExt = imageFile.name.split('.').pop();
      const imagePath = `${Date.now()}.${imageExt}`;
      const { data: storageData, error: uploadError } = await supabase
        .storage
        .from('property-images')
        .upload(imagePath, imageFile);

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: publicURLData } = supabase
        .storage
        .from('property-images')
        .getPublicUrl(imagePath);

      const image_url = publicURLData.publicUrl;

      // 3. Insert property into DB
      const { error: insertError } = await supabase
        .from('properties')
        .insert([
          { ...propertyData, image_url }
        ]);

      if (insertError) throw insertError;

      setSuccessMsg('Property uploaded successfully!');
      setPropertyData({ name: '', description: '', location: '' });
      setImageFile(null);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-upload container">
      <h1>Admin Property Upload</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: 'auto' }}>
        <input
          type="text"
          name="name"
          placeholder="Property Name"
          value={propertyData.name}
          onChange={handleChange}
          required
        /><br />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={propertyData.description}
          onChange={handleChange}
          required
        /><br />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={propertyData.location}
          onChange={handleChange}
          required
        /><br />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        /><br />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Property'}
        </button>
      </form>
      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
    </div>
  );
};

export default AdminUpload;
