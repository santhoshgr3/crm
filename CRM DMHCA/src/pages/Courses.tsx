import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import CourseCard from '../components/Courses/CourseCard';

export default function Courses() {
  const { state } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredCourses = React.useMemo(() => {
    return state.courses.filter(course => {
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        (course.name && course.name.toLowerCase().includes(term)) ||
        (course.description && course.description.toLowerCase().includes(term)) ||
        (course.category && course.category.toLowerCase().includes(term));
      
      const matchesCategory = categoryFilter === 'All' || course.category === categoryFilter;

      return matchesSearch && matchesCategory && course.isActive;
    });
  }, [state.courses, searchTerm, categoryFilter]);

  // Group courses by category
  const groupedCourses = React.useMemo(() => {
    const groups: Record<string, typeof filteredCourses> = {};
    filteredCourses.forEach(course => {
      if (!groups[course.category]) groups[course.category] = [];
      groups[course.category].push(course);
    });
    return groups;
  }, [filteredCourses]);

  const categories = ['All', 'Fellowship', 'PG Diploma', 'Certification'];

  // For horizontal options
  const programOptions = categories.filter(c => c !== 'All');
  const [selectedProgram, setSelectedProgram] = useState<string>('');

  // Show random course on page load
  const [randomCourse, setRandomCourse] = useState<typeof state.courses[0] | null>(null);
  React.useEffect(() => {
    if (state.courses.length > 0) {
      setRandomCourse(state.courses[Math.floor(Math.random() * state.courses.length)]);
    }
  }, [state.courses]);

  // Filtered/grouped by selected program
  const visibleCourses = selectedProgram
    ? (groupedCourses[selectedProgram] || [])
    : filteredCourses;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Catalog</h1>
          <p className="text-gray-600 mt-1">Browse and manage DMHCA medical education programs</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <div className="flex items-center text-sm text-gray-600">
            <Filter className="h-4 w-4 mr-1" />
            {filteredCourses.length} courses available
          </div>
        </div>
      </div>

      {/* Horizontal Program Options */}
      <div className="flex space-x-4 mb-6">
        {programOptions.map(option => (
          <button
            key={option}
            className={`px-4 py-2 rounded-full font-semibold border transition-colors duration-200 ${selectedProgram === option ? 'bg-violet-700 text-white' : 'bg-white text-violet-700 border-violet-200 hover:bg-violet-100'}`}
            onClick={() => setSelectedProgram(option === selectedProgram ? '' : option)}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Show random course if no filter/search */}
      {(!searchTerm && !selectedProgram && randomCourse) && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-violet-700">Featured Course</h2>
          <CourseCard course={randomCourse} />
        </div>
      )}

      {/* Courses Grid (filtered by program if selected) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Filter className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}