// src/services/jobService.ts
import api from "./api";

// ✅ Types
export interface Job {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  user_id: number;
  created_at: string;
  is_approved: boolean;
  status: string;
}

export interface CreateJobData {
  title: string;
  description: string;
  company: string;
  location: string;
}

export interface UpdateJobData {
  title?: string;
  description?: string;
  company?: string;
  location?: string;
}

export interface JobFilters {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  company?: string;
  is_approved?: boolean;
}

export interface JobsResponse {
  message: string;
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
}

export interface JobResponse {
  message: string;
  job: Job;
}

// ✅ Job Service Class
class JobService {
  // ✅ Create New Job
  async createJob(jobData: CreateJobData): Promise<JobResponse> {
    try {
      const response = await api.post<JobResponse>("/jobs", jobData);
      return response.data;
    } catch (error) {
      console.error("Create job error:", error);
      throw error;
    }
  }

  // ✅ Get All Jobs with Filters
  async getJobs(filters: JobFilters = {}): Promise<JobsResponse> {
    try {
      const response = await api.get<JobsResponse>("/jobs", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Get jobs error:", error);
      throw error;
    }
  }

  // ✅ Get Job by ID
  async getJobById(id: string | number): Promise<JobResponse> {
    try {
      const response = await api.get<JobResponse>(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error("Get job by ID error:", error);
      throw error;
    }
  }

  // ✅ Update Job
  async updateJob(id: string, jobData: UpdateJobData): Promise<JobResponse> {
    try {
      const response = await api.patch<JobResponse>(`/jobs/${id}`, jobData);
      return response.data;
    } catch (error) {
      console.error("Update job error:", error);
      throw error;
    }
  }

  // ✅ Delete Job
  async deleteJob(id: string): Promise<{ message: string }> {
    try {
      const response = await api.delete<{ message: string }>(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error("Delete job error:", error);
      throw error;
    }
  }

  // ✅ Get My Jobs (for employers/admins)
  async getMyJobs(): Promise<JobsResponse> {
    try {
      const response = await api.get<JobsResponse>("/jobs/me");
      return response.data;
    } catch (error) {
      console.error("Get my jobs error:", error);
      throw error;
    }
  }

  // ✅ Get Jobs by Company
  async getJobsByCompany(company: string): Promise<JobsResponse> {
    try {
      const response = await api.get<JobsResponse>("/jobs", {
        params: { company },
      });
      return response.data;
    } catch (error) {
      console.error("Get jobs by company error:", error);
      throw error;
    }
  }

  // ✅ Get Jobs by Location
  async getJobsByLocation(location: string): Promise<JobsResponse> {
    try {
      const response = await api.get<JobsResponse>("/jobs", {
        params: { location },
      });
      return response.data;
    } catch (error) {
      console.error("Get jobs by location error:", error);
      throw error;
    }
  }

  // ✅ Search Jobs
  async searchJobs(
    query: string,
    filters: Omit<JobFilters, "search"> = {}
  ): Promise<JobsResponse> {
    try {
      const response = await api.get<JobsResponse>("/jobs", {
        params: { ...filters, search: query },
      });
      return response.data;
    } catch (error) {
      console.error("Search jobs error:", error);
      throw error;
    }
  }
}

export const jobService = new JobService();
