import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useAppointmentStore, Appointment } from '../../stores/appointmentStore';
import { Calendar, Clock, CreditCard, User, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

const PatientDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { appointments, fetchAppointments } = useAppointmentStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        setIsLoading(true);
        await fetchAppointments(user.id, 'patient');
        setIsLoading(false);
      };
      
      loadData();
    }
  }, [user, fetchAppointments]);

  const upcomingAppointments = appointments.filter(
    apt => apt.status !== 'cancelled' && apt.status !== 'completed'
  );
  
  const getStatusBadge = (status: Appointment['status'], paymentStatus: Appointment['paymentStatus']) => {
    if (status === 'cancelled') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertTriangle size={12} className="mr-1" />
          Cancelled
        </span>
      );
    }
    
    if (paymentStatus === 'pending') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <CreditCard size={12} className="mr-1" />
          Payment pending
        </span>
      );
    }
    
    if (status === 'confirmed') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle size={12} className="mr-1" />
          Confirmed
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <Clock size={12} className="mr-1" />
        Scheduled
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Welcome, {user?.name}</h2>
          <p className="mt-1 text-sm text-gray-600">
            Here's an overview of your upcoming appointments and health information.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <div className="bg-blue-50 rounded-lg p-5 flex flex-col">
            <div className="flex items-center text-blue-700 mb-2">
              <Calendar size={20} className="mr-2" />
              <h3 className="font-semibold">Appointments</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{upcomingAppointments.length}</p>
            <p className="text-sm text-gray-600 mt-1">Upcoming</p>
            <div className="mt-auto pt-4">
              <Link 
                to="/patient/appointments/book"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
              >
                Book new appointment
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-5 flex flex-col">
            <div className="flex items-center text-green-700 mb-2">
              <FileText size={20} className="mr-2" />
              <h3 className="font-semibold">Medical Records</h3>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Securely store and manage your complete medical history.
            </p>
            <div className="mt-auto pt-4">
              <Link 
                to="/patient/medical-records"
                className="text-green-600 hover:text-green-800 text-sm font-medium inline-flex items-center"
              >
                View records
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-5 flex flex-col">
            <div className="flex items-center text-purple-700 mb-2">
              <User size={20} className="mr-2" />
              <h3 className="font-semibold">Your Profile</h3>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Update your personal information and preferences.
            </p>
            <div className="mt-auto pt-4">
              <Link 
                to="#"
                className="text-purple-600 hover:text-purple-800 text-sm font-medium inline-flex items-center"
              >
                Edit profile
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">
              Loading appointments...
            </div>
          ) : upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="p-6 transition-colors hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div className="mb-4 sm:mb-0">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">{appointment.doctorName}</h3>
                      <span className="ml-3">
                        {getStatusBadge(appointment.status, appointment.paymentStatus)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Calendar size={16} className="mr-1 text-gray-400" />
                      <span>{new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      <span className="mx-2">•</span>
                      <Clock size={16} className="mr-1 text-gray-400" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:items-end">
                    <p className="text-lg font-medium text-gray-900">${appointment.appointmentFee.toFixed(2)}</p>
                    {appointment.paymentStatus === 'pending' && (
                      <Link
                        to={`/patient/payment/${appointment.id}`}
                        className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <CreditCard size={14} className="mr-1" />
                        Complete Payment
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">You don't have any upcoming appointments.</p>
              <Link
                to="/patient/appointments/book"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Book an appointment
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;