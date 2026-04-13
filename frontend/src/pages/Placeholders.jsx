import React from 'react';
import { Link } from 'react-router-dom';

const placeholderPages = ['Experience', 'Services', 'Blog', 'BlogDetail', 'Testimonials', 'NotFound'];

export default function PlaceholderPage() {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Page Coming Soon</h1>
        <p className="text-gray-400 mb-8">This page is currently under development</p>
        <Link to="/" className="px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg inline-block transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

// Export individual placeholders to avoid too many files
export function Experience() { return <PlaceholderPage />; }
export function Services() { return <PlaceholderPage />; }
export function Blog() { return <PlaceholderPage />; }
export function BlogDetail() { return <PlaceholderPage />; }
export function Testimonials() { return <PlaceholderPage />; }
export function NotFound() {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-gray-400 mb-8 text-xl">Page not found</p>
        <Link to="/" className="px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg inline-block transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
