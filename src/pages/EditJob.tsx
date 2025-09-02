// src/pages/EditJob.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jobService } from "../services/jobService";

const EditJob = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await jobService.getJobById(id);
        setFormData({
          title: res.job.title,
          description: res.job.description,
          company: res.job.company,
          location: res.job.location,
        });
        setError(null);
      } catch (err) {
        console.error("Failed to load job:", err);
        setError("Failed to load job ❌");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setLoading(true);
      await jobService.updateJob(id, formData);
      navigate(`/jobs/${id}`);
    } catch (err) {
      console.error("Failed to update job:", err);
      setError("Failed to update job ❌");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading job...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Job</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Job Title"
          className="w-full border p-2 rounded"
        />
        <input
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Company"
          className="w-full border p-2 rounded"
        />
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded h-32"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Job
        </button>
      </form>
    </div>
  );
};

export default EditJob;
