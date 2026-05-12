import React from 'react';
import { Student } from '../types';
import { Edit2, Trash2, GraduationCap } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: any) => void;
  isLoading?: boolean;
}

export const StudentList: React.FC<StudentListProps> = ({ 
  students, 
  onEdit, 
  onDelete,
  isLoading 
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredStudents = (students || []).filter(student => 
    (student.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (student.studentId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (student.course?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium tracking-tight">Accessing Records...</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded shadow-sm p-12 text-center">
        <div className="bg-slate-50 w-16 h-16 rounded flex items-center justify-center mx-auto mb-4 border border-slate-200">
          <GraduationCap className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Registry Empty</h3>
        <p className="text-[10px] text-slate-500 max-w-xs mx-auto mt-2 uppercase font-medium">
          No student data detected in the database.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden flex flex-col">
      <div className="p-3 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
        <h2 className="text-[10px] font-bold uppercase text-slate-600 tracking-tight">Active Student Registry</h2>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Search Students..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-[10px] px-2 py-1 border border-slate-200 rounded w-48 outline-hidden font-medium"
          />
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded leading-none flex items-center">
            {filteredStudents.length} / {students.length} RECORDS
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table id="student-table" className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 sticky top-0 border-b border-slate-200">
              <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Student ID</th>
              <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Full Name</th>
              <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Course</th>
              <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Gender</th>
              <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-tighter text-center">Year</th>
              <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Email Address</th>
              <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-tighter text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-blue-50 transition-colors group cursor-pointer">
                <td className="p-3 text-xs font-mono">{student.studentId}</td>
                <td className="p-3 text-xs font-bold text-slate-800 uppercase">{student.fullName}</td>
                <td className="p-3">
                  <span className="bg-blue-100 text-blue-700 px-1 rounded text-[10px] font-bold uppercase">
                    {student.course}
                  </span>
                </td>
                <td className="p-3 text-xs text-slate-600">{student.gender}</td>
                <td className="p-3 text-xs text-slate-600">{student.yearLevel}</td>
                <td className="p-3 text-xs text-slate-500">{student.email}</td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      id={`edit-${student.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(student);
                      }}
                      className="text-[10px] text-blue-600 font-bold hover:underline uppercase tracking-tighter"
                      title="Edit Record"
                    >
                      EDIT
                    </button>
                    <span className="text-slate-200">|</span>
                    <button
                      type="button"
                      id={`delete-${student.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(student.id);
                      }}
                      className="text-[10px] text-red-500 font-bold hover:underline uppercase tracking-tighter"
                      title="Delete Record"
                    >
                      DELETE
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
