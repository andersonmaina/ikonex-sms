import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CreateSubjectModal } from '../components/CreateSubjectModal';

interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
  credits: number;
  subject_assignments: {
    id: string;
    class_streams: { id: string; name: string; code: string };
  }[];
}

const API_URL = import.meta.env.VITE_API_URL;

const fetchSubjects = async (): Promise<Subject[]> => {
  const { data } = await axios.get(`${API_URL}/api/subjects`);
  return data.data;
};

const Subjects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: subjects, isLoading, isError } = useQuery({
    queryKey: ['subjects'],
    queryFn: fetchSubjects,
  });

  return (
    <div className="p-lg flex flex-col gap-lg overflow-y-auto w-full max-w-[1440px] mx-auto">
      {/* Page Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-md mt-xl">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary">Subject & Curriculum</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-sm">
            Manage academic courses, departmental allocations, and class stream assignments. Maintain high academic standards through structured curriculum tracking.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-on-primary px-lg py-3 rounded-lg flex items-center gap-sm font-label-md text-label-md font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          ADD NEW SUBJECT
        </button>
      </section>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-md">
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex items-center gap-md">
          <div className="w-12 h-12 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined">library_books</span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant">Total Subjects</p>
            <p className="font-headline-md text-headline-md font-bold text-primary">{subjects?.length || 0}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex items-center gap-md">
          <div className="w-12 h-12 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined">hub</span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant">Active Assignments</p>
            <p className="font-headline-md text-headline-md font-bold text-primary">
              {subjects?.reduce((acc, sub) => acc + sub.subject_assignments.length, 0) || 0}
            </p>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex items-center gap-md">
          <div className="w-12 h-12 rounded-lg bg-surface-container text-on-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined">verified</span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant">Accredited</p>
            <p className="font-headline-md text-headline-md font-bold text-primary">{subjects?.length || 0}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex items-center gap-md">
          <div className="w-12 h-12 rounded-lg bg-error-container text-on-error-container flex items-center justify-center">
            <span className="material-symbols-outlined">warning</span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant">Unassigned</p>
            <p className="font-headline-md text-headline-md font-bold text-primary">
              {subjects?.filter(s => s.subject_assignments.length === 0).length || 0}
            </p>
          </div>
        </div>
      </section>

      {/* Main Data Workspace */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="px-lg py-md border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
          <h3 className="font-headline-md text-headline-md text-primary">Academic Subject List</h3>
          <div className="flex gap-sm">
            <button className="p-2 border border-outline-variant rounded hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
            </button>
            <button className="p-2 border border-outline-variant rounded hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">download</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low font-label-md text-label-md text-primary border-b border-outline-variant uppercase tracking-wider">
                <th className="px-lg py-4 font-bold">Subject Code</th>
                <th className="px-lg py-4 font-bold">Name & Department</th>
                <th className="px-lg py-4 font-bold">Assigned Streams</th>
                <th className="px-lg py-4 font-bold">Credits</th>
                <th className="px-lg py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md divide-y divide-outline-variant/30">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-xl text-center">
                    <span className="material-symbols-outlined animate-spin text-primary">autorenew</span>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="p-xl text-center text-error bg-error-container">Failed to load subjects</td>
                </tr>
              ) : subjects?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-xl text-center text-on-surface-variant">No subjects added yet.</td>
                </tr>
              ) : (
                subjects?.map((subject) => (
                  <tr key={subject.id} className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="px-lg py-md">
                      <span className="bg-surface-container-high px-sm py-1 rounded font-mono text-[11px] font-bold text-primary">{subject.code}</span>
                    </td>
                    <td className="px-lg py-md">
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface">{subject.name}</span>
                        <span className="text-xs text-on-surface-variant">{subject.department || 'General'}</span>
                      </div>
                    </td>
                    <td className="px-lg py-md">
                      <div className="flex flex-wrap gap-xs">
                        {subject.subject_assignments.length === 0 ? (
                          <span className="text-xs text-on-surface-variant italic">None</span>
                        ) : (
                          subject.subject_assignments.map(assignment => (
                            <span key={assignment.id} className="bg-secondary-container/10 text-secondary border border-secondary/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              {assignment.class_streams?.name}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-xs">
                        <span className="material-symbols-outlined text-primary text-sm">stars</span>
                        <span>{subject.credits}</span>
                      </div>
                    </td>
                    <td className="px-lg py-md text-right">
                      <div className="flex items-center justify-end gap-sm opacity-50 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded transition-all">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded transition-all">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <CreateSubjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Subjects;
