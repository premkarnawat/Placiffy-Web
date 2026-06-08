import React from 'react';
import ResumeForm from '@/components/candidate/profile/ResumeForm';

export default function ResumeManagementPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Resume Management</h1>
        <p className="text-gray-500 mt-1">Manage your active ATS-parsed resume and similarity vectors.</p>
      </div>
      
      <ResumeForm />
    </div>
  );
}
