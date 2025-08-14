// Mock database functions for the Inter-Institutional Data Exchange Portal

export interface Institution {
  [x: string]: any;
  id: string;
  name: string;
  type: string;
  status: "active" | "inactive" | "pending";
  contactEmail: string;
  apiEndpoint?: string;
  description: string;
  createdAt: string;
  lastActive: string;
}

export interface APIRequest {
  id: string;
  title: string;
  description: string;
  purpose: string;
  consumerId: string;
  providerId: string;
  status: "pending" | "approved" | "rejected";
  priority: "high" | "medium" | "low";
  responseFormat: string;
  attributes: string[];
  submittedDate: string;
  responseDate?: string;
  apiEndpoint?: string;
  rejectionReason?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "consumer" | "provider";
  institutionId: string;
  createdAt: string;
  lastLogin: string;
}

// Mock data
const mockInstitutions: Institution[] = [
  {
    id: "1",
    name: "Ministry of Education",
    type: "Government",
    status: "active",
    contactEmail: "api@education.gov",
    apiEndpoint: "https://api.education.gov/v1",
    description: "National education data and student records",
    createdAt: "2024-01-01",
    lastActive: "2024-01-16",
  },
  {
    id: "2",
    name: "National Research Council",
    type: "Research",
    status: "active",
    contactEmail: "data@research.gov",
    apiEndpoint: "https://api.research.gov/v2",
    description: "Research publications and academic metrics",
    createdAt: "2024-01-02",
    lastActive: "2024-01-15",
  },
];

const mockRequests: APIRequest[] = [
  {
    id: "1",
    title: "Student Enrollment Data API",
    description: "Request for real-time student enrollment data",
    purpose: "Academic research and institutional reporting",
    consumerId: "1",
    providerId: "1",
    status: "pending",
    priority: "high",
    responseFormat: "JSON",
    attributes: ["student_id", "enrollment_date", "course_code"],
    submittedDate: "2024-01-16",
  },
];

// Database functions
export async function getInstitutions(): Promise<Institution[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockInstitutions), 100);
  });
}

export async function getInstitutionById(
  id: string
): Promise<Institution | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const institution = mockInstitutions.find((inst) => inst.id === id);
      resolve(institution || null);
    }, 100);
  });
}

export async function createInstitution(
  institution: Omit<Institution, "id" | "createdAt">
): Promise<Institution> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newInstitution: Institution = {
        ...institution,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      mockInstitutions.push(newInstitution);
      resolve(newInstitution);
    }, 100);
  });
}

export async function updateInstitution(
  id: string,
  updates: Partial<Institution>
): Promise<Institution | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockInstitutions.findIndex((inst) => inst.id === id);
      if (index !== -1) {
        mockInstitutions[index] = { ...mockInstitutions[index], ...updates };
        resolve(mockInstitutions[index]);
      } else {
        resolve(null);
      }
    }, 100);
  });
}

export async function deleteInstitution(id: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockInstitutions.findIndex((inst) => inst.id === id);
      if (index !== -1) {
        mockInstitutions.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 100);
  });
}

export async function getAPIRequests(): Promise<APIRequest[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockRequests), 100);
  });
}

export async function createAPIRequest(
  request: Omit<APIRequest, "id" | "submittedDate">
): Promise<APIRequest> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRequest: APIRequest = {
        ...request,
        id: Date.now().toString(),
        submittedDate: new Date().toISOString(),
      };
      mockRequests.push(newRequest);
      resolve(newRequest);
    }, 100);
  });
}

export async function updateAPIRequest(
  id: string,
  updates: Partial<APIRequest>
): Promise<APIRequest | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockRequests.findIndex((req) => req.id === id);
      if (index !== -1) {
        mockRequests[index] = { ...mockRequests[index], ...updates };
        resolve(mockRequests[index]);
      } else {
        resolve(null);
      }
    }, 100);
  });
}
