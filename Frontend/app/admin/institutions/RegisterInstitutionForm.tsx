"use client";

import { useState, useEffect, useRef } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, X } from "react-feather";
import { useRouter } from "next/navigation";

interface PasswordRequirements {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

interface InstitutionFormData {
  name: string;
  type: string;
  status: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  services: string[];
  username: string;
  password: string;
  confirmPassword: string;
}

interface RegisterInstitutionFormProps {
  onRegister: (data: InstitutionFormData) => void;
  onCancel: () => void;
}

export default function RegisterInstitutionForm({
  onRegister,
  onCancel,
}: RegisterInstitutionFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<InstitutionFormData>({
    name: "",
    type: "",
    status: "Active",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    services: [],
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordRequirements, setPasswordRequirements] =
    useState<PasswordRequirements>({
      hasMinLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false,
    });
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [types, setTypes] = useState([
    "Government Service",
    "Government Ministry",
    "Government Commission",
    "Telecommunications",
  ]);
  const [addingType, setAddingType] = useState(false);
  const [newType, setNewType] = useState("");
  const newTypeInputRef = useRef<HTMLInputElement>(null);
  const [newService, setNewService] = useState("");

  useEffect(() => {
    if (form.password) {
      setPasswordRequirements({
        hasMinLength: form.password.length >= 8,
        hasUpperCase: /[A-Z]/.test(form.password),
        hasLowerCase: /[a-z]/.test(form.password),
        hasNumber: /\d/.test(form.password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
      });
    }
  }, [form.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password" && passwordError) {
      setPasswordError("");
    }
  };

  const validateForm = (): boolean => {
    // Validate password
    const {
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
    } = passwordRequirements;

    if (!hasMinLength) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }

    if (!hasUpperCase || !hasLowerCase) {
      setPasswordError(
        "Password must contain both uppercase and lowercase letters"
      );
      return false;
    }

    if (!hasNumber) {
      setPasswordError("Password must contain at least one number");
      return false;
    }

    if (!hasSpecialChar) {
      setPasswordError("Password must contain at least one special character");
      return false;
    }

    // Validate password match
    if (form.password !== form.confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleServiceAdd = () => {
    if (newService.trim()) {
      setForm({ ...form, services: [...form.services, newService.trim()] });
      setNewService("");
    }
  };

  const handleServiceRemove = (idx: number) => {
    setForm({
      ...form,
      services: form.services.filter((_, i) => i !== idx),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name: form.name,
      type: form.type,
      contactPerson: form.contactPerson,
      email: form.email,
      phone: form.phone,
      address: form.address,
      services: form.services,
      status: form.status,
      username: form.username,
      password: form.password,
      confirmPassword: form.confirmPassword,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/institutions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (response.status === 401 || response.status === 403) {
        alert("Session expired. Please log in again.");
        router.push("/login");

        return;
      }

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to register institution");
        return;
      }

      alert("Institution registered successfully");
      onRegister(data);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculatePasswordStrength = () => {
    if (form.password.length === 0) return 0;
    const fulfilledRequirements = Object.values(passwordRequirements).filter(
      (v) => v
    ).length;
    return Math.min(
      (form.password.length / 12) * 50 + fulfilledRequirements * 10,
      100
    );
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 40) return "bg-red-500";
    if (strength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthLabel = (strength: number) => {
    if (strength < 40) return "Weak";
    if (strength < 70) return "Moderate";
    return "Strong";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Institution Name
          </label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Type</label>
          {!addingType ? (
            <Select
              value={form.type}
              onValueChange={(value) => {
                if (value === "__add_new__") {
                  setAddingType(true);
                  setTimeout(() => newTypeInputRef.current?.focus(), 100);
                } else {
                  setForm({ ...form, type: value });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select or add type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
                <SelectItem value="__add_new__" className="text-blue-600">
                  + Add new type
                </SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="flex gap-2">
              <Input
                ref={newTypeInputRef}
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                placeholder="Enter new type"
              />
              <Button
                type="button"
                onClick={() => {
                  if (newType.trim() && !types.includes(newType.trim())) {
                    setTypes([...types, newType.trim()]);
                    setForm({ ...form, type: newType.trim() });
                  }
                  setAddingType(false);
                  setNewType("");
                }}
              >
                Add
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAddingType(false);
                  setNewType("");
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select
            value={form.status}
            onValueChange={(value) => setForm({ ...form, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Contact Person
          </label>
          <Input
            name="contactPerson"
            value={form.contactPerson}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <Input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <Input
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <Input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setShowPasswordRequirements(true)}
              onBlur={() => setShowPasswordRequirements(false)}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {showPasswordRequirements && (
            <div className="mt-2 text-sm text-gray-600">
              <p className="font-medium">Password must contain:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li
                  className={
                    passwordRequirements.hasMinLength ? "text-green-500" : ""
                  }
                >
                  At least 8 characters
                </li>
                <li
                  className={
                    passwordRequirements.hasUpperCase ? "text-green-500" : ""
                  }
                >
                  At least one uppercase letter
                </li>
                <li
                  className={
                    passwordRequirements.hasLowerCase ? "text-green-500" : ""
                  }
                >
                  At least one lowercase letter
                </li>
                <li
                  className={
                    passwordRequirements.hasNumber ? "text-green-500" : ""
                  }
                >
                  At least one number
                </li>
                <li
                  className={
                    passwordRequirements.hasSpecialChar ? "text-green-500" : ""
                  }
                >
                  At least one special character
                </li>
              </ul>
            </div>
          )}

          {form.password && (
            <div className="mt-2">
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getPasswordStrengthColor(
                    calculatePasswordStrength()
                  )}`}
                  style={{ width: `${calculatePasswordStrength()}%` }}
                />
              </div>
              <p className="text-xs mt-1 text-gray-500">
                Password strength:{" "}
                {getPasswordStrengthLabel(calculatePasswordStrength())}
              </p>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Services</label>
        <div className="space-y-2">
          {form.services.map((service, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="flex-1 text-sm">{service}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleServiceRemove(idx)}
              >
                <X className="w-4 h-4 mr-1" /> Remove
              </Button>
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Add service"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              className="flex-1"
            />
            <Button type="button" onClick={handleServiceAdd}>
              Add
            </Button>
          </div>
        </div>
      </div>

      {passwordError && (
        <div className="text-sm text-red-600 p-2 bg-red-50 rounded-md">
          {passwordError}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register Institution"}
        </Button>
      </div>
    </form>
  );
}
