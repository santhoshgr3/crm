import React from 'react';
import { Clock, DollarSign, GraduationCap, Users } from 'lucide-react';
import { Course } from '../../types';
import axios from 'axios';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const [currency, setCurrency] = React.useState<'INR' | 'USD' | 'BDT'>('INR');
  const [rates, setRates] = React.useState<{ USD: number; BDT: number }>({ USD: 0.012, BDT: 1.4 });

  React.useEffect(() => {
    // Fetch live rates from exchangerate-api.com (or similar)
    axios.get('https://api.exchangerate-api.com/v4/latest/INR')
      .then(res => {
        setRates({
          USD: res.data.rates.USD,
          BDT: res.data.rates.BDT
        });
      })
      .catch(() => {}); // fallback to static if error
  }, []);

  const getCategoryColor = (category: string) => {
    const colors = {
      'Fellowship': 'bg-blue-100 text-blue-800 border-blue-200',
      'PG Diploma': 'bg-green-100 text-green-800 border-green-200',
      'Certification': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatPrice = (price: number) => {
    if (currency === 'INR') {
      if (price >= 100000) {
        return `₹${(price / 100000).toFixed(1)}L`;
      }
      return `₹${price.toLocaleString('en-IN')}`;
    }
    if (currency === 'USD') {
      return `$${(price * rates.USD).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
    }
    if (currency === 'BDT') {
      return `৳${(price * rates.BDT).toLocaleString('en-BD', { maximumFractionDigits: 0 })}`;
    }
    return price;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.name}</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${getCategoryColor(course.category)}`}>
            <GraduationCap className="h-3 w-3 mr-1" />
            {course.category}
          </span>
        </div>
        <select
          value={currency}
          onChange={e => setCurrency(e.target.value as 'INR' | 'USD' | 'BDT')}
          className="ml-2 px-2 py-1 text-xs border rounded"
        >
          <option value="INR">₹ INR</option>
          <option value="USD">$ USD</option>
          <option value="BDT">৳ BDT</option>
        </select>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Fee</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">{formatPrice(course.price)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Duration</span>
          </div>
          <span className="text-sm font-medium text-gray-900">{course.duration}</span>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-400 mt-0.5" />
            <span className="text-sm text-gray-600">Eligibility</span>
          </div>
          <span className="text-sm text-gray-900 text-right max-w-[60%]">{course.eligibility}</span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {course.isActive ? '● Active' : '● Inactive'}
        </span>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200">
          View Details
        </button>
      </div>
    </div>
  );
}