import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const fetchStudentProfile = async (id: string) => {
  const { data } = await axios.get(`${API_URL}/api/grades/student/${id}`);
  return data.data;
};

const StudentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [isDownloading, setIsDownloading] = React.useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['studentProfile', id],
    queryFn: () => fetchStudentProfile(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-xl">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">autorenew</span>
      </div>
    );
  }

  if (isError || !data?.student) {
    return (
      <div className="p-xl text-center text-error bg-error-container rounded-lg mx-lg mt-lg">
        Failed to load student profile.
      </div>
    );
  }

  const { student, grades } = data;

  // Calculate Cumulative Average (simplistic calculation based on available data)
  const totalScore = grades?.reduce((sum: number, g: any) => sum + Number(g.score), 0) || 0;
  const maxTotalScore = grades?.reduce((sum: number, g: any) => sum + Number(g.assessments?.max_score || 100), 0) || 0;
  const cumulativeAverage = maxTotalScore > 0 ? ((totalScore / maxTotalScore) * 100).toFixed(1) : '0.0';

  // Matches backend GRADING_SYSTEM constants exactly
  const getGradeLetter = (percentage: number) => {
    if (percentage >= 70) return 'A';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  return (
    <div className="p-lg max-w-[1200px] mx-auto w-full space-y-xl">
      {/* Breadcrumb & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md no-print">
        <div>
          <nav className="flex items-center gap-xs text-on-surface-variant font-label-md mb-xs">
            <Link to="/students" className="hover:text-primary cursor-pointer transition-colors">Students</Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-primary font-bold">Performance Profile</span>
          </nav>
          <h2 className="font-headline-xl text-headline-xl text-primary">Student Analytics & Reporting</h2>
        </div>
        <div className="flex gap-md">
          <button 
            disabled={isDownloading}
            onClick={async () => {
              try {
                setIsDownloading(true);
                const response = await axios.get(`${API_URL}/api/reports/student/${id}/pdf`, {
                  responseType: 'blob'
                });
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${student.first_name}_${student.last_name}_ReportCard.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
              } catch (err) {
                alert('Failed to download PDF');
              } finally {
                setIsDownloading(false);
              }
            }}
            className={`flex items-center gap-sm bg-primary text-on-primary px-lg py-md rounded-lg font-label-md transition-all shadow-md ${isDownloading ? 'opacity-70 cursor-wait' : 'hover:bg-primary-container active:scale-95'}`}
          >
            {isDownloading ? (
              <span className="material-symbols-outlined text-[20px] animate-spin">autorenew</span>
            ) : (
              <span className="material-symbols-outlined text-[20px]">download</span>
            )}
            {isDownloading ? 'Generating...' : 'Download PDF Report'}
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
        
        {/* Student Profile Card (Bento Item 1) */}
        <div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col items-center text-center shadow-sm no-print relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-primary-container/20"></div>
          <div className="relative w-32 h-32 mb-md mt-4">
            <div className="absolute inset-0 border-4 border-primary/10 rounded-full animate-pulse"></div>
            <div className="w-full h-full rounded-full border-4 border-surface shadow-lg bg-surface-variant flex items-center justify-center text-primary font-headline-xl text-4xl uppercase">
              {student.first_name.charAt(0)}{student.last_name.charAt(0)}
            </div>
            <div className="absolute bottom-1 right-1 bg-secondary text-on-secondary p-1 rounded-full border-2 border-surface">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
          </div>
          <h3 className="font-headline-md text-headline-md text-primary">{student.first_name} {student.last_name}</h3>
          <p className="font-body-md text-on-surface-variant">ID: #{student.admission_number}</p>
          
          <div className="w-full mt-lg grid grid-cols-2 gap-sm">
            <div className="bg-surface-container-low p-sm rounded-lg border border-outline-variant/30">
              <p className="text-[10px] uppercase tracking-wider text-outline">Class Stream</p>
              <p className="font-headline-md text-primary">{student.class_streams?.name || 'Unassigned'}</p>
            </div>
            <div className="bg-surface-container-low p-sm rounded-lg border border-outline-variant/30">
              <p className="text-[10px] uppercase tracking-wider text-outline">Overall Avg</p>
              <p className="font-headline-md text-secondary">{cumulativeAverage}%</p>
            </div>
          </div>
        </div>

        {/* PDF-Style Report Card Table */}
        <div className="md:col-span-12 bg-white rounded-xl border border-outline-variant overflow-hidden shadow-xl print:shadow-none print:border-none">
          {/* Header */}
          <div className="bg-primary text-on-primary p-xl flex justify-between items-center">
            <div className="space-y-sm">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-[32px]">school</span>
                <h1 className="font-headline-xl text-headline-xl uppercase tracking-tighter">Ikonex Academy</h1>
              </div>
              <p className="text-on-primary-container font-label-md">Official Academic Record</p>
            </div>
          </div>

          {/* Body */}
          <div className="p-xl bg-white space-y-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg border-b border-outline-variant pb-lg">
              <div>
                <p className="text-[11px] font-bold text-outline uppercase mb-1">Student Full Name</p>
                <p className="font-headline-md text-primary">{student.first_name} {student.last_name}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-outline uppercase mb-1">Registration Number</p>
                <p className="font-headline-md text-primary">{student.admission_number}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-outline uppercase mb-1">Class Stream</p>
                <p className="font-headline-md text-primary">{student.class_streams?.name || 'Unassigned'}</p>
              </div>
            </div>

            {/* Grades Table */}
            <div className="overflow-x-auto rounded-lg border border-outline-variant">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low">
                    <th className="px-md py-lg font-headline-md text-primary border-b border-outline-variant w-1/2">Assessment Title</th>
                    <th className="px-md py-lg font-headline-md text-primary border-b border-outline-variant text-center">Type</th>
                    <th className="px-md py-lg font-headline-md text-primary border-b border-outline-variant text-center">Score</th>
                    <th className="px-md py-lg font-headline-md text-primary border-b border-outline-variant text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="text-on-surface">
                  {grades?.length === 0 ? (
                     <tr>
                        <td colSpan={4} className="px-md py-xl text-center text-on-surface-variant italic border-b border-outline-variant">
                           No grades available.
                        </td>
                     </tr>
                  ) : (
                    grades?.map((g: any) => {
                      const max = g.assessments?.max_score || 100;
                      const pct = (g.score / max) * 100;
                      const letter = getGradeLetter(pct);
                      
                      return (
                        <tr key={g.id} className="hover:bg-surface-container/50 transition-colors">
                          <td className="px-md py-md border-b border-outline-variant font-bold">{g.assessments?.title}</td>
                          <td className="px-md py-md border-b border-outline-variant text-center text-on-surface-variant uppercase text-sm">{g.assessments?.type}</td>
                          <td className="px-md py-md border-b border-outline-variant text-center font-bold">{g.score} / {max}</td>
                          <td className="px-md py-md border-b border-outline-variant text-center">
                            <span className={`px-sm py-xs rounded font-bold ${
                              letter === 'A' || letter === 'B' ? 'bg-secondary/10 text-secondary' :
                              letter === 'C' ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'
                            }`}>
                              {letter}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-primary-container text-on-primary">
                    <td className="px-md py-lg font-bold">CUMULATIVE AVERAGE</td>
                    <td colSpan={2}></td>
                    <td className="px-md py-lg text-center font-headline-md">{cumulativeAverage}%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
