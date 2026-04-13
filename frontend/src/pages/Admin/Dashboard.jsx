import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        <p className="text-gray-400 mb-8">Dashboard content coming soon...</p>
        <Link to="/" className="text-primary-500 hover:text-primary-400">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
