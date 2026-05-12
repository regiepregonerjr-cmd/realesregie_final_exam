/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StudentForm } from './components/StudentForm';
import { StudentList } from './components/StudentList';
import { Student } from './types';

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      console.log('App: Fetching students...');
      const response = await fetch('/api/students');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log('App: Received students:', data.length);
      setStudents(data);
    } catch (error) {
      console.error('App: Failed to fetch students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (studentData: Omit<Student, 'id'>) => {
    setIsSubmitting(true);
    try {
      let response;
      if (editingStudent) {
        console.log(`App: Updating student ${editingStudent.id}...`);
        response = await fetch(`/api/students/${editingStudent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentData),
        });
      } else {
        console.log('App: Creating new student...');
        response = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentData),
        });
      }

      if (response.ok) {
        console.log('App: Save successful');
        setEditingStudent(null);
        await fetchStudents();
      } else {
        const errorData = await response.json();
        console.error('App: Save failed:', errorData.error);
        alert(`Error: ${errorData.error || 'Failed to save student record'}`);
      }
    } catch (error) {
      console.error('App: Network error during save:', error);
      alert('Network error: Could not connect to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!id) {
      console.error('App: Cannot delete student without ID');
      return;
    }

    try {
      console.log(`App: Deleting student ID: ${id}...`);
      const response = await fetch(`/api/students/${id}`, { 
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        console.log('App: Delete successful');
        if (editingStudent && editingStudent.id === id) {
          setEditingStudent(null);
        }
        await fetchStudents();
      } else {
        const errorData = await response.json();
        console.error('App: Delete failed:', errorData.error);
        alert(`Error: ${errorData.error || 'Failed to delete record'}`);
      }
    } catch (error) {
      console.error('App: Network error during delete:', error);
      alert('Network error: Could not connect to the server.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 overflow-x-hidden">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-12 gap-6 bg-slate-50">
        
        <aside className="col-span-12 lg:col-span-4 flex flex-col gap-4 order-2 lg:order-1">
          <StudentForm 
            onSubmit={handleSubmit} 
            initialData={editingStudent}
            onCancel={editingStudent ? () => setEditingStudent(null) : undefined}
            isSubmitting={isSubmitting}
          />
          
          <div className="bg-slate-900 text-slate-400 p-4 rounded shadow-sm">
            <h3 className="text-[10px] font-bold uppercase text-slate-500 mb-2 tracking-widest border-b border-slate-800 pb-2">Deployment Info</h3>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-[10px]">
                <span className="uppercase">Project</span>
                <span className="text-white">IT318 FINAL EXAM</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="uppercase">Platform</span>
                <span className="text-white">RENDER / AIVEN</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="uppercase">Stack</span>
                <span className="text-white">NODE.JS + MYSQL</span>
              </div>
            </div>
          </div>
        </aside>

        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 order-1 lg:order-2">
          <StudentList 
            students={students} 
            onEdit={setEditingStudent} 
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </div>

      </main>

      <footer className="bg-white border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase">
          <span>CRUD OPERATIONAL</span>
          <span>&bull;</span>
          <span>AIVEN CLOUD READY</span>
        </div>
        <div className="text-[10px] font-medium text-slate-500 uppercase tracking-widest text-center">
          &copy; 2024 IT318-WebDev Final Practical Examination
        </div>
      </footer>
    </div>
  );
}
