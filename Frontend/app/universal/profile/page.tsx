"use client";
import { useState, useEffect } from "react";

type User = {
  name: string;
  email: string;
  role: string;
  initials: string;
  avatar: string;
};

type ProfileProps = {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
};

export default function Profile({ user, onSave, onCancel }: ProfileProps) {
  const [editedUser, setEditedUser] = useState(user);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatar
  );

  useEffect(() => {
    setEditedUser(user);
    setAvatarPreview(user.avatar);
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setEditedUser((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(editedUser); // Will close modal via parent
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Edit Profile
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Avatar
          </label>
          <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center overflow-hidden">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
            ) : user.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-foreground">
                {user.initials.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="mt-2 block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={editedUser.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg bg-card text-foreground focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={editedUser.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg bg-card text-foreground focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-foreground border rounded-lg hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-[hsl(25_31%_23%)] to-[hsl(25_37%_30%)] bg-gradient-to-r hover:bg-[hsl(25_31%_17%)] hover:to-[hsl(25_31%_23%)] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
