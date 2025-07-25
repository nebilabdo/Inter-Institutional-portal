import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

export default function RegisterInstitutionForm({
  onRegister,
  onCancel,
}: {
  onRegister: (inst: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    type: "",
    status: "Active",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    services: [] as string[],
  });
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleServiceAdd = () => {
    if (newService.trim()) {
      setForm({ ...form, services: [...form.services, newService.trim()] });
      setNewService("");
    }
  };

  const handleServiceRemove = (idx: number) => {
    setForm({ ...form, services: form.services.filter((_, i) => i !== idx) });
  };

  return (
    <div className="flex flex-col rounded-2xl shadow-lg bg-transparent w-full max-w-xl mx-auto items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onRegister(form);
        }}
        className="w-full bg-white p-10 md:p-16 space-y-10 md:space-y-12 max-w-xl"
      >
        <div>
          <label htmlFor="name" className="block text-lg font-bold mb-2">
            Institution Name
          </label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-blue-100"
            placeholder="Enter the institution name"
            required
          />
        </div>
        <div className="space-y-3">
          <label htmlFor="type" className="block text-lg font-bold mb-2">
            Type
          </label>
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
              <SelectTrigger id="type" className="w-full bg-blue-100">
                <SelectValue placeholder="Select or add type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((t, idx) => (
                  <SelectItem key={t + idx} value={t}>
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
                className="w-full bg-blue-100"
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
                variant="ghost"
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
          <label htmlFor="status" className="block text-lg font-bold mb-2">
            Status
          </label>
          <Select
            value={form.status}
            onValueChange={(value) => setForm({ ...form, status: value })}
          >
            <SelectTrigger id="status" className="w-full bg-blue-100">
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
          <label
            htmlFor="contactPerson"
            className="block text-lg font-bold mb-2"
          >
            Contact Person
          </label>
          <Input
            id="contactPerson"
            name="contactPerson"
            value={form.contactPerson}
            onChange={handleChange}
            className="w-full bg-blue-100"
            placeholder="Contact Person"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-lg font-bold mb-2">
            Email
          </label>
          <Input
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-blue-100"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-lg font-bold mb-2">
            Phone
          </label>
          <Input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full bg-blue-100"
            placeholder="Enter phone number"
            required
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-lg font-bold mb-2">
            Address
          </label>
          <Input
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full bg-blue-100"
            placeholder="Enter your address"
            required
          />
        </div>
        {/* Services Section */}
        <div>
          <label className="block text-lg font-bold mb-2">Services</label>
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
                  Remove
                </Button>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add service"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                className="flex-1 bg-blue-100"
              />
              <Button type="button" onClick={handleServiceAdd}>
                Add
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Register</Button>
        </div>
      </form>
    </div>
  );
}
