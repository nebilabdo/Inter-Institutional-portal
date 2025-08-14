import { useState, useRef, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Camera,
  FileText,
  IdCard,
  X,
  Eye,
  FlipHorizontal,
  FlipVertical,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

export interface DocumentFile {
  id: string;
  type: "national_id" | "document";
  file: File;
  url: string;
  name: string;
}

interface DocumentCaptureProps {
  documents: DocumentFile[];
  onDocumentsChange: (documents: DocumentFile[]) => void;
}

export const DocumentCapture = ({
  documents,
  onDocumentsChange,
}: DocumentCaptureProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureType, setCaptureType] = useState<"national_id" | "document">(
    "national_id"
  );
  const [nationalIdSides, setNationalIdSides] = useState<{
    front?: string;
    back?: string;
  }>({});
  const [currentSide, setCurrentSide] = useState<"front" | "back">("front");
  const [isFlipped, setIsFlipped] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<
    "environment" | "user"
  >("environment");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async (type: "national_id" | "document") => {
    setCaptureType(type);

    try {
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          title: "Camera Not Supported",
          description: "Your device doesn't support camera access.",
          variant: "destructive",
        });
        return;
      }

      setIsCapturing(true);
      setNationalIdSides({});
      setCurrentSide("front");
      setIsFlipped(false);
      setCameraFacingMode("environment");

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      // Start with preferred camera facing mode
      await startCameraStream(cameraFacingMode);

      toast({
        title: "Camera Ready",
        description: "Position your document in the frame and tap capture",
        variant: "default",
      });
    } catch (error: any) {
      handleCameraError(error);
    }
  };

  const startCameraStream = async (facingMode: "environment" | "user") => {
    try {
      // Tablet-friendly constraints
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise<void>((resolve) => {
          videoRef.current!.onloadedmetadata = () => resolve();
        });
      }
    } catch (error) {
      // If preferred camera fails, try any camera
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current = fallbackStream;

        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          await new Promise<void>((resolve) => {
            videoRef.current!.onloadedmetadata = () => resolve();
          });
        }
      } catch (fallbackError) {
        handleCameraError(fallbackError);
      }
    }
  };

  const handleCameraError = (error: any) => {
    console.error("Error accessing camera:", error);

    let errorMessage = "Could not access camera.";
    let actionMessage = "Please check your device settings.";

    if (error.name === "NotAllowedError") {
      errorMessage = "Camera access denied.";
      actionMessage =
        "Please allow camera permissions in your device settings.";
    } else if (error.name === "NotFoundError") {
      errorMessage = "No camera found on this device.";
    }

    toast({
      title: "Camera Error",
      description: `${errorMessage} ${actionMessage}`,
      variant: "destructive",
    });
    setIsCapturing(false);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
    setNationalIdSides({});
  };

  const flipCamera = async () => {
    if (!streamRef.current) return;

    try {
      // Stop current stream
      streamRef.current.getTracks().forEach((track) => track.stop());

      // Flip the camera
      const newFacingMode =
        cameraFacingMode === "environment" ? "user" : "environment";
      setCameraFacingMode(newFacingMode);

      // Start new stream with flipped camera
      await startCameraStream(newFacingMode);

      setIsFlipped(!isFlipped);
    } catch (error) {
      console.error("Error flipping camera:", error);
      toast({
        title: "Camera Flip Failed",
        description: "Could not switch camera view",
        variant: "destructive",
      });
    }
  };

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    if (videoRef.current.readyState !== 4) {
      toast({
        title: "Camera Not Ready",
        description: "Please wait for the camera to initialize",
        variant: "destructive",
      });
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Flip image if needed
    if (isFlipped) {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      context.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          toast({
            title: "Capture Failed",
            description: "Could not capture image from camera",
            variant: "destructive",
          });
          return;
        }

        if (captureType === "national_id") {
          // Save the captured side
          const dataUrl = URL.createObjectURL(blob);
          const newSides = { ...nationalIdSides, [currentSide]: dataUrl };
          setNationalIdSides(newSides);

          if (currentSide === "front") {
            // Switch to back side
            setCurrentSide("back");
            toast({
              title: "Front Captured",
              description: "Now capture the back side of your ID",
              variant: "default",
            });
          } else {
            // Both sides captured, generate PDF
            generateNationalIdPDF(newSides.front!, newSides.back!);
            stopCamera();
          }
        } else {
          // Convert captured document to PDF
          try {
            const pdf = new jsPDF({
              orientation: "portrait",
              unit: "mm",
              format: "a4",
            });

            // Create image from blob to get dimensions
            const img = new Image();
            img.src = URL.createObjectURL(blob);
            await new Promise((resolve) => {
              img.onload = resolve;
            });

            // Calculate dimensions to fit page
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = img.width;
            const imgHeight = img.height;

            const ratio = Math.min(
              (pageWidth - 20) / imgWidth,
              (pageHeight - 20) / imgHeight
            );
            const width = imgWidth * ratio;
            const height = imgHeight * ratio;
            const x = (pageWidth - width) / 2;
            const y = (pageHeight - height) / 2;

            // Add image to PDF
            pdf.addImage(img, "JPEG", x, y, width, height);

            // Generate PDF blob
            const pdfBlob = pdf.output("blob");
            const fileName = `document_${Date.now()}.pdf`;
            const pdfUrl = URL.createObjectURL(pdfBlob);

            const pdfFile = new File([pdfBlob], fileName, {
              type: "application/pdf",
            });

            const newDocument: DocumentFile = {
              id: Date.now().toString(),
              type: "document",
              file: pdfFile,
              url: pdfUrl,
              name: fileName,
            };

            // Add new document without removing existing ones
            onDocumentsChange([...documents, newDocument]);

            toast({
              title: "Document Captured",
              description: "Document saved as PDF",
              variant: "default",
            });

            stopCamera();
          } catch (error) {
            console.error("PDF creation error:", error);
            toast({
              title: "PDF Creation Failed",
              description: "Could not convert document to PDF",
              variant: "destructive",
            });
            stopCamera();
          }
        }
      },
      "image/jpeg",
      0.9
    );
  }, [
    captureType,
    documents,
    onDocumentsChange,
    toast,
    nationalIdSides,
    currentSide,
    isFlipped,
  ]);

  const generateNationalIdPDF = (frontDataUrl: string, backDataUrl: string) => {
    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Calculate dimensions to fit page
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Add front page
      pdf.addImage(
        frontDataUrl,
        "JPEG",
        10,
        10,
        pageWidth - 20,
        pageHeight - 20
      );

      // Add back page
      pdf.addPage();
      pdf.addImage(
        backDataUrl,
        "JPEG",
        10,
        10,
        pageWidth - 20,
        pageHeight - 20
      );

      // Generate PDF blob
      const pdfBlob = pdf.output("blob");
      const fileName = `national_id_${Date.now()}.pdf`;
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const pdfFile = new File([pdfBlob], fileName, {
        type: "application/pdf",
      });

      const newDocument: DocumentFile = {
        id: Date.now().toString(),
        type: "national_id",
        file: pdfFile,
        url: pdfUrl,
        name: fileName,
      };

      // Remove existing national ID document
      const filteredDocs = documents.filter(
        (doc) => doc.type !== "national_id"
      );
      onDocumentsChange([...filteredDocs, newDocument]);

      toast({
        title: "National ID Captured",
        description: "Both sides captured and merged into a PDF",
        variant: "default",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "PDF Creation Failed",
        description: "Could not create PDF document",
        variant: "destructive",
      });
    }
  };

  const removeDocument = (id: string) => {
    const updatedDocs = documents.filter((doc) => doc.id !== id);
    onDocumentsChange(updatedDocs);

    toast({
      title: "Document Removed",
      description: "Document has been removed",
      variant: "default",
    });
  };

  const previewDocument = (doc: DocumentFile) => {
    window.open(doc.url, "_blank");
  };

  // Get documents by type
  const nationalIdDoc = documents.find((doc) => doc.type === "national_id");
  const supportingDocs = documents.filter((doc) => doc.type === "document");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Document Capture
        </CardTitle>
        <CardDescription>
          Capture your national ID and supporting documents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Camera View */}
        {isCapturing && (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 border-2 border-dashed border-white/50 m-4">
                <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {captureType === "national_id"
                    ? `National ID ${
                        currentSide === "front" ? "Front" : "Back"
                      }`
                    : "Document"}
                </div>
                <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {cameraFacingMode === "environment"
                    ? "Back Camera"
                    : "Front Camera"}
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-center flex-wrap">
              <Button onClick={captureImage} size="lg">
                <Camera className="w-4 h-4 mr-2" />
                {captureType === "national_id"
                  ? `Capture ${currentSide === "front" ? "Front" : "Back"}`
                  : "Capture"}
              </Button>
              <Button variant="outline" onClick={stopCamera} size="lg">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button variant="outline" onClick={flipCamera} size="lg">
                {isFlipped ? (
                  <FlipVertical className="w-4 h-4 mr-2" />
                ) : (
                  <FlipHorizontal className="w-4 h-4 mr-2" />
                )}
                Flip Camera
              </Button>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {!isCapturing && (
          <>
            {/* National ID Section */}
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center gap-2">
                <IdCard className="w-4 h-4" />
                National ID
              </Label>
              {nationalIdDoc ? (
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IdCard className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{nationalIdDoc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(nationalIdDoc.file.size / 1024 / 1024).toFixed(2)}{" "}
                          MB
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => previewDocument(nationalIdDoc)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeDocument(nationalIdDoc.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                  <IdCard className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-medium">National ID Required</p>
                    <p className="text-sm text-muted-foreground">
                      Capture both sides of your national ID
                    </p>
                    <p className="text-xs text-warning mt-1">
                      💡 Allow camera permissions when prompted
                    </p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={() => startCamera("national_id")}
                      variant="default"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Scan Both Sides
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Supporting Document Section */}
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Supporting Documents
              </Label>

              {/* List of supporting documents */}
              {supportingDocs.length > 0 && (
                <div className="space-y-3">
                  {supportingDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                            {doc.name.endsWith(".pdf") ? (
                              <FileText className="w-6 h-6 text-success" />
                            ) : (
                              <Camera className="w-6 h-6 text-success" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => previewDocument(doc)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeDocument(doc.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add more documents section */}
              <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {supportingDocs.length === 0
                      ? "Supporting Documents"
                      : "Add More Documents"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {supportingDocs.length === 0
                      ? "Capture additional documents"
                      : "Capture additional documents"}
                  </p>
                  <p className="text-xs text-warning mt-1">
                    💡 Allow camera permissions when prompted
                  </p>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => startCamera("document")}
                    variant="default"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Scan Document
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
