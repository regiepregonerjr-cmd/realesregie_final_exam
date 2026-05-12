import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { UserPlus, Save, X } from 'lucide-react';

interface StudentFormProps {
  onSubmit: (student: Omit<Student, 'id'>) => void;
  initialData?: Student | null;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export const StudentForm: React.FC<StudentFormProps> = ({ 
  onSubmit, 
  initialData, 
  onCancel,
  isSubmitting 
}) => {
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    course: '',
    yearLevel: '1st Year',
    gender: 'Male',
    email: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        studentId: initialData.studentId,
        fullName: initialData.fullName,
        course: initialData.course,
        yearLevel: initialData.yearLevel,
        gender: initialData.gender || 'Male',
        email: initialData.email,
      });
    } else {
      setFormData({
        studentId: '',
        fullName: '',
        course: '',
        yearLevel: '1st Year',
        gender: 'Male',
        email: '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData) {
      setFormData({
        studentId: '',
        fullName: '',
        course: '',
        yearLevel: '1st Year',
        gender: 'Male',
        email: '',
      });
    }
  };

  return (
    <form id="student-form" onSubmit={handleSubmit} className="bg-white p-5 rounded border border-slate-200 shadow-sm space-y-3">
      <div className="flex items-center justify-between mb-2 border-b border-slate-100 pb-3">
        <h2 className="text-xs font-bold uppercase text-slate-600 tracking-wider">
          {initialData ? 'Update Record' : 'Add New Student'}
        </h2>
        {initialData ? <Save className="w-3.5 h-3.5 text-blue-600" /> : <UserPlus className="w-3.5 h-3.5 text-blue-600" />}
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor="studentId" className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Student ID</label>
          <input
            id="studentId"
            type="text"
            name="studentId"
            required
            value={formData.studentId}
            onChange={handleChange}
            placeholder="e.g. 2024-0001"
            className="w-full px-3 py-1.5 focus:outline-hidden font-mono"
          />
        </div>

        <div>
          <label htmlFor="fullName" className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Full Name</label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Last Name, First Name"
            className="w-full px-3 py-1.5 focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="course" className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Course</label>
            <input
              id="course"
              type="text"
              name="course"
              required
              value={formData.course}
              onChange={handleChange}
              placeholder="BSIT"
              className="w-full px-3 py-1.5 focus:outline-hidden"
            />
          </div>

          <div>
            <label htmlFor="yearLevel" className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Year Level</label>
            <select
              id="yearLevel"
              name="yearLevel"
              required
              value={formData.yearLevel}
              onChange={handleChange}
              className="w-full px-3 py-1.5 focus:outline-hidden bg-white"
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="gender" className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Gender</label>
          <select
            id="gender"
            name="gender"
            required
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-1.5 focus:outline-hidden bg-white"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="email" className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="student@university.edu"
            className="w-full px-3 py-1.5 focus:outline-hidden"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          id="btn-submit"
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded transition-colors uppercase tracking-widest disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : (initialData ? 'Update Student' : 'Save Record')}
        </button>
        {onCancel && (
          <button
            id="btn-cancel"
            type="button"
            onClick={onCancel}
            className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-2 rounded border border-slate-300 transition-colors uppercase"
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
};
