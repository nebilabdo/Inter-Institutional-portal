import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

export interface CustomerInfo {
  fullName: string;
}

interface CustomerFormProps {
  customerInfo: CustomerInfo;
  onCustomerInfoChange: (info: CustomerInfo) => void;
}

export const CustomerForm = ({
  customerInfo,
  onCustomerInfoChange,
}: CustomerFormProps) => {
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  const handleChange = (value: string) => {
    onCustomerInfoChange({
      fullName: value,
    });

    // Clear error when user starts typing
    if (errors.fullName) {
      setErrors({});
    }
  };

  const validateForm = () => {
    const newErrors: Partial<CustomerInfo> = {};

    if (!customerInfo.fullName.trim()) {
      newErrors.fullName = "Customer name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Customer Information
        </CardTitle>
        <CardDescription>
          Enter your contact details for the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Customer Name *
          </Label>
          <Input
            id="fullName"
            value={customerInfo.fullName}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Enter customer name"
            className={errors.fullName ? "border-destructive" : ""}
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">{errors.fullName}</p>
          )}
          <p className="text-xs text-muted-foreground">
            This name will be used to identify the document submission
          </p>
        </div>

        {/* Required Fields Note */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <p>* Customer name is required for document submission</p>
        </div>
      </CardContent>
    </Card>
  );
};
