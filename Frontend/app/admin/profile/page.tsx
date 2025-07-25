"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@system.com",
    phone: "+251-11-123-4567",
    institution: "System Administration",
    bio: "System administrator with full access to manage institutions and requests.",
    photo: ""
  });
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [originalProfile, setOriginalProfile] = useState({ ...profile });

  const handleChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setOriginalProfile({ ...profile });
    setIsEditing(false);
    // Here you would typically save to backend
    console.log('Profile saved:', profile);
  };

  const handleCancel = () => {
    setProfile({ ...originalProfile });
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      setProfile(prev => ({ ...prev, photo: url }));
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-blue-100 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-200 rounded-full opacity-40 z-0" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-blue-200 rounded-full opacity-30 z-0" />
      <div className="relative z-10 w-full max-w-2xl p-6 sm:p-10 rounded-2xl shadow-xl bg-gradient-to-r from-white via-blue-50 to-blue-100 border border-blue-400" style={{ minHeight: 500 }}>
        <div className="flex flex-row items-start gap-8">
          <div className="flex flex-col items-center gap-4 min-w-[160px]">
            <div
              className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-blue-100 flex items-center justify-center cursor-pointer group"
              onClick={() => isEditing && fileInputRef.current?.click()}
              title={isEditing ? "Click to change photo" : undefined}
              style={{ position: 'relative' }}
            >
              {profile.photo || photoPreview ? (
                <img
                  src={photoPreview || profile.photo}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-6xl font-bold text-blue-600">{profile.firstName.charAt(0)}</span>
              )}
              {isEditing && (
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white bg-opacity-80 text-xs px-2 py-1 rounded shadow group-hover:bg-blue-200 transition">Change Photo</span>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
            {!isEditing ? (
              <button 
                className="bg-blue-300 hover:bg-blue-400 text-blue-900 font-semibold px-4 py-2 rounded-lg shadow text-base transition-all border border-blue-400"
                onClick={handleEdit}
              >
                + Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  className="bg-green-300 hover:bg-green-400 text-green-900 font-semibold px-4 py-2 rounded-lg shadow text-base transition-all border border-green-400"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button 
                  className="bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold px-4 py-2 rounded-lg shadow text-base transition-all border border-gray-400"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <form className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="sm:col-span-2 text-center mb-2">
              <h2 className="text-2xl font-bold mb-1">My Profile</h2>
              <p className="text-base text-gray-700">Manage your account details and preferences</p>
            </div>
            <label className="font-bold">First Name
              <input 
                type="text" 
                className="block w-full bg-blue-100 rounded-md px-4 py-2 mt-1 shadow font-normal" 
                value={profile.firstName} 
                onChange={(e) => handleChange('firstName', e.target.value)}
                disabled={!isEditing}
                required
              />
            </label>
            <label className="font-bold">Last Name
              <input 
                type="text" 
                className="block w-full bg-blue-100 rounded-md px-4 py-2 mt-1 shadow font-normal" 
                value={profile.lastName} 
                onChange={(e) => handleChange('lastName', e.target.value)}
                disabled={!isEditing}
                required
              />
            </label>
            <label className="font-bold sm:col-span-1">Email Address
              <input 
                type="email" 
                className="block w-full bg-blue-100 rounded-md px-4 py-2 mt-1 shadow font-normal" 
                value={profile.email} 
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={!isEditing}
                required
              />
            </label>
            <label className="font-bold sm:col-span-1">Phone Number
              <input 
                type="text" 
                className="block w-full bg-blue-100 rounded-md px-4 py-2 mt-1 shadow font-normal" 
                value={profile.phone} 
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={!isEditing}
                required
              />
            </label>
            <label className="font-bold sm:col-span-2">Institution
              <input 
                type="text" 
                className="block w-full bg-blue-100 rounded-md px-4 py-2 mt-1 shadow font-normal" 
                value={profile.institution} 
                onChange={(e) => handleChange('institution', e.target.value)}
                disabled={!isEditing}
                required
              />
            </label>
            <label className="font-bold sm:col-span-2">Bio
              <textarea 
                className="block w-full bg-blue-100 rounded-md px-4 py-2 mt-1 shadow font-normal" 
                rows={2} 
                value={profile.bio} 
                onChange={(e) => handleChange('bio', e.target.value)}
                disabled={!isEditing}
              />
            </label>
          </form>
        </div>
      </div>
    </div>
  );
} 