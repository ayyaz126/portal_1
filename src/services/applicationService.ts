// src/services/applicationService.ts
import api from "./api";

// ✅ Types
export interface Application {
  id: number;
  job_id: number;
  user_id: number;
  resume: string;
  cover_letter: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
}

export type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "shortlisted"
  | "rejected"
  | "accepted";

export interface CreateApplicationData {
  jobId: number;
  resume: File;
  coverLetter: string;
}

export interface UpdateApplicationData {
  status?: ApplicationStatus;
  coverLetter?: string;
}

export interface ApplicationsResponse {
  message: string;
  applications: Application[];
  total: number;
}

export interface ApplicationResponse {
  message: string;
  application: Application;
}

// ✅ Application Service Class
class ApplicationService {
  // ✅ Apply for a Job
  async applyJob(
    jobId: number,
    resume: File,
    coverLetter: string
  ): Promise<ApplicationResponse> {
    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("coverLetter", coverLetter);

      const response = await api.post<ApplicationResponse>(
        `/jobs/${jobId}/apply`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Apply job error:", error);
      throw error;
    }
  }

  // ✅ Get My Applications
  async getMyApplications(): Promise<ApplicationsResponse> {
    try {
      const response = await api.get<ApplicationsResponse>("/applications/me");
      return response.data;
    } catch (error) {
      console.error("Get my applications error:", error);
      throw error;
    }
  }

  // ✅ Get Application by ID
  async getApplicationById(id: number): Promise<ApplicationResponse> {
    try {
      const response = await api.get<ApplicationResponse>(
        `/applications/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Get application by ID error:", error);
      throw error;
    }
  }

  // ✅ Update Application
  async updateApplication(
    id: number,
    data: UpdateApplicationData
  ): Promise<ApplicationResponse> {
    try {
      const response = await api.patch<ApplicationResponse>(
        `/applications/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Update application error:", error);
      throw error;
    }
  }

  // ✅ Delete Application
  async deleteApplication(id: number): Promise<{ message: string }> {
    try {
      const response = await api.delete<{ message: string }>(
        `/applications/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Delete application error:", error);
      throw error;
    }
  }

  // ✅ Get Applications for a Job (for employers)
  async getJobApplications(jobId: number): Promise<ApplicationsResponse> {
    try {
      const response = await api.get<ApplicationsResponse>(
        `/jobs/${jobId}/applications`
      );
      return response.data;
    } catch (error) {
      console.error("Get job applications error:", error);
      throw error;
    }
  }

  // ✅ Update Application Status
  async updateApplicationStatus(
    id: number,
    status: ApplicationStatus
  ): Promise<ApplicationResponse> {
    try {
      const response = await api.patch<ApplicationResponse>(
        `/applications/${id}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error("Update application status error:", error);
      throw error;
    }
  }

  // ✅ Get Applications by Status
  async getApplicationsByStatus(
    status: ApplicationStatus
  ): Promise<ApplicationsResponse> {
    try {
      const response = await api.get<ApplicationsResponse>("/applications", {
        params: { status },
      });
      return response.data;
    } catch (error) {
      console.error("Get applications by status error:", error);
      throw error;
    }
  }

  // ✅ Withdraw Application
  async withdrawApplication(id: number): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(
        `/applications/${id}/withdraw`
      );
      return response.data;
    } catch (error) {
      console.error("Withdraw application error:", error);
      throw error;
    }
  }
}

export const applicationService = new ApplicationService();
