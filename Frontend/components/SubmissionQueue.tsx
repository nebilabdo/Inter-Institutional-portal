import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Clock,
  Send,
  FileCheck,
  AlertCircle,
} from "lucide-react";
import type { Institution } from "./InstitutionSelector";
import type { DocumentFile } from "./DocumentCapture";
import type { CustomerInfo } from "./CustomerForm";
import { useToast } from "@/hooks/use-toast";

export interface SubmissionItem {
  id: string;
  institution: Institution;
  status: "pending" | "processing" | "completed" | "error";
  timestamp?: Date;
  progress: number;
}

interface SubmissionQueueProps {
  institutions: Institution[];
  documents: DocumentFile[];
  customerInfo: CustomerInfo;
  onSubmissionComplete: () => void;
}

export const SubmissionQueue = ({
  institutions,
  documents,
  customerInfo,
  onSubmissionComplete,
}: SubmissionQueueProps) => {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const canSubmit = () => {
    return (
      institutions.length > 0 &&
      documents.some((d) => d.type === "national_id") &&
      customerInfo.fullName.trim()
    );
  };

  const simulateFileProcessing = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`processed_${file.name}`);
      }, 1000 + Math.random() * 2000);
    });
  };

  const submitToInstitution = async (
    institution: Institution
  ): Promise<void> => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.institution.id === institution.id
          ? { ...sub, status: "processing", progress: 0 }
          : sub
      )
    );

    try {
      // Prepare FormData for multipart/form-data
      const formData = new FormData();
      formData.append("customer_name", customerInfo.fullName);
      formData.append("institution_ids", JSON.stringify([institution.id]));

      // Append files
      documents.forEach((doc) => {
        if (doc.type === "national_id") {
          formData.append("national_id", doc.file); // multer expects this name
        } else {
          formData.append("supporting_docs", doc.file); // multer expects array for these
        }
      });

      const response = await fetch("http://localhost:5000/api/submit", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to submit to ${institution.name}`);
      }

      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.institution.id === institution.id
            ? {
                ...sub,
                status: "completed",
                progress: 100,
                timestamp: new Date(),
              }
            : sub
        )
      );
    } catch (error) {
      console.error(error);
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.institution.id === institution.id
            ? { ...sub, status: "error", progress: 100, timestamp: new Date() }
            : sub
        )
      );
      throw error;
    }
  };

  const handleSubmitAll = async () => {
    if (!canSubmit()) {
      toast({
        title: "Cannot Submit",
        description:
          "Please select at least one institution, provide your name, and upload a national ID",
        variant: "destructive",
      });
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    const initialSubmissions: SubmissionItem[] = institutions.map(
      (institution) => ({
        id: `${institution.id}_${Date.now()}`,
        institution,
        status: "pending",
        progress: 0,
      })
    );

    setSubmissions(initialSubmissions);

    try {
      const nationalId = documents.find((d) => d.type === "national_id");
      const supportingDocs = documents.filter((d) => d.type === "document");

      await Promise.all([
        nationalId
          ? simulateFileProcessing(nationalId.file)
          : Promise.resolve(),
        ...supportingDocs.map((doc) => simulateFileProcessing(doc.file)),
      ]);

      let successfulCount = 0;

      for (let i = 0; i < institutions.length; i++) {
        const institution = institutions[i];
        try {
          await submitToInstitution(institution);
          successfulCount++;
          toast({
            title: "Submission Successful",
            description: `Successfully submitted to ${institution.name}`,
            variant: "default",
          });
        } catch {
          toast({
            title: "Submission Failed",
            description: `Failed to submit to ${institution.name}`,
            variant: "destructive",
          });
        }

        if (i < institutions.length - 1)
          await new Promise((r) => setTimeout(r, 500));
      }

      if (successfulCount === institutions.length) {
        toast({
          title: "All Submissions Complete",
          description: "Successfully submitted to all selected institutions",
          variant: "default",
        });
        onSubmissionComplete();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: SubmissionItem["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      case "processing":
        return <Send className="w-4 h-4 text-primary animate-pulse" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const getStatusBadge = (status: SubmissionItem["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "processing":
        return (
          <Badge className="bg-primary text-primary-foreground">
            Processing
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-success text-success-foreground">
            Completed
          </Badge>
        );
      case "error":
        return <Badge variant="destructive">Error</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="w-5 h-5" />
          Submission Queue
        </CardTitle>
        <CardDescription>
          Review and submit your application to selected institutions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Institutions</p>
            <p className="text-2xl font-bold">{institutions.length}</p>
          </div>
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Documents</p>
            <p className="text-2xl font-bold">{documents.length}</p>
          </div>
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="text-2xl font-bold">
              {canSubmit() ? "Ready" : "Pending"}
            </p>
          </div>
        </div>

        {/* Checklist */}
        <div
          className="space-y-2"
          role="region"
          aria-label="Requirements Checklist"
        >
          <h4 className="font-medium">Requirements Checklist</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2" role="status">
              {institutions.length > 0 ? (
                <CheckCircle2
                  className="w-4 h-4 text-success"
                  aria-hidden="true"
                />
              ) : (
                <AlertCircle
                  className="w-4 h-4 text-muted-foreground"
                  aria-hidden="true"
                />
              )}
              <span
                className={
                  institutions.length > 0
                    ? "text-success"
                    : "text-muted-foreground"
                }
              >
                At least one institution selected
              </span>
            </div>
            <div className="flex items-center gap-2" role="status">
              {documents.some((d) => d.type === "national_id") ? (
                <CheckCircle2
                  className="w-4 h-4 text-success"
                  aria-hidden="true"
                />
              ) : (
                <AlertCircle
                  className="w-4 h-4 text-muted-foreground"
                  aria-hidden="true"
                />
              )}
              <span
                className={
                  documents.some((d) => d.type === "national_id")
                    ? "text-success"
                    : "text-muted-foreground"
                }
              >
                National ID uploaded
              </span>
            </div>
            <div className="flex items-center gap-2" role="status">
              <CheckCircle2
                className="w-4 h-4 text-success"
                aria-hidden="true"
              />
              <span className="text-success">
                Supporting documents (optional):{" "}
                {documents.filter((d) => d.type === "document").length} uploaded
              </span>
            </div>
            <div className="flex items-center gap-2" role="status">
              {customerInfo.fullName ? (
                <CheckCircle2
                  className="w-4 h-4 text-success"
                  aria-hidden="true"
                />
              ) : (
                <AlertCircle
                  className="w-4 h-4 text-muted-foreground"
                  aria-hidden="true"
                />
              )}
              <span
                className={
                  customerInfo.fullName
                    ? "text-success"
                    : "text-muted-foreground"
                }
              >
                Customer name provided
              </span>
            </div>
          </div>
        </div>

        {/* Submission Progress */}
        {submissions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Submission Progress</h4>
            {submissions.map((submission, index) => (
              <div
                key={submission.id}
                className="border rounded-lg p-4 space-y-3"
                role="status"
                aria-label={`Submission to ${submission.institution.name}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(submission.status)}
                    <div>
                      <p className="font-medium">
                        {index + 1}. {submission.institution.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {submission.institution.code}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(submission.status)}
                    {submission.timestamp && (
                      <span className="text-xs text-muted-foreground">
                        {submission.timestamp.toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>

                {submission.status === "processing" && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Processing...</span>
                      <span>{Math.round(submission.progress)}%</span>
                    </div>
                    <Progress
                      value={submission.progress}
                      className="w-full"
                      aria-label={`Progress: ${Math.round(
                        submission.progress
                      )}%`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmitAll}
          disabled={!canSubmit() || isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Send className="w-4 h-4 mr-2 animate-pulse" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit to All Institutions
            </>
          )}
        </Button>

        {!canSubmit() && (
          <p className="text-sm text-muted-foreground text-center">
            Complete all required fields above to enable submission
          </p>
        )}
      </CardContent>
    </Card>
  );
};
