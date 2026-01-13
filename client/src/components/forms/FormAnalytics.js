import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const FormAnalytics = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { 'x-auth-token': token }
        };

        const [formRes, responsesRes] = await Promise.all([
          axios.get(`/api/forms/${id}`, config),
          axios.get(`/api/responses/${id}`, config)
        ]);

        setForm(formRes.data);
        setResponses(responsesRes.data);
        processAnalytics(formRes.data, responsesRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const processAnalytics = (formData, responsesData) => {
    const analyticsData = {};

    formData.fields.forEach(field => {
      if (['radio', 'checkbox', 'dropdown'].includes(field.type)) {
        const counts = {};
        field.options?.forEach(opt => {
          counts[opt.label] = 0;
        });

        responsesData.forEach(response => {
          const answer = response.responses?.find(a => a.fieldId === field.id);
          if (answer) {
            if (Array.isArray(answer.value)) {
              answer.value.forEach(v => {
                counts[v] = (counts[v] || 0) + 1;
              });
            } else {
              counts[answer.value] = (counts[answer.value] || 0) + 1;
            }
          }
        });

        analyticsData[field.id] = Object.entries(counts).map(([name, value]) => ({
          name,
          value
        }));
      }
    });

    setAnalytics(analyticsData);
  };

  if (loading) {
    return <div className="text-center mt-8">Loading analytics...</div>;
  }

  if (!form) {
    return <div className="text-center mt-8">Form not found</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{form.title} - Analytics</h1>
        <Link to={`/form/${id}/responses`} className="btn btn-outline">
          View Responses
        </Link>
      </div>

      <div className="card p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Overview</h3>
        <p>Total Responses: {responses.length}</p>
      </div>

      {form.fields
        .filter(field => ['radio', 'checkbox', 'dropdown'].includes(field.type))
        .map(field => (
          <div key={field.id} className="card p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4">{field.label}</h3>
            {analytics[field.id] && analytics[field.id].length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics[field.id]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics[field.id]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {analytics[field.id].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </div>
        ))}
    </div>
  );
};

export default FormAnalytics;
