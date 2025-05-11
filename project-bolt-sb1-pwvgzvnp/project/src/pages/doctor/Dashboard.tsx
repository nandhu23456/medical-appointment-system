import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useAppointmentStore, Appointment } from '../../stores/appointmentStore';
import { Calendar, Clock, User, CheckCircle, Stethoscope, AlertTriangle } from 'lucide-react';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { appointments, fetchAppointments } = useAppointmentStore();
  const [isLoading, setIsLoading] = useState(true);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        setIsLoading(true);
        await fetchAppointments(user.id, 'doctor');
        setIsLoading(false);
      };
      
      loadData();
    }
  }, [user, fetchAppointments]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    const todayAppts = appointments.filter(
      apt => apt.date === today && apt.status !== 'cancelled'
    );
    
    const upcomingAppts = appointments.filter(
      apt => apt.date > today && apt.status !== 'cancelled'
    ).slice(0, 5); // Get next 5 upcoming appointments
    
    setTodayAppointments(todayAppts);
    setUpcomingAppointments(upcomingAppts);
  }, [appointments]);

  const getStatusBadge = (status: Appointment['status']) => {
    if (status === 'cancelled') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertTriangle size={12} className="mr-1" />
          Cancelled
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

  const appointmentCounts = {
    today: todayAppointments.length,
    upcoming: upcomingAppointments.length,
    total: appointments.filter(apt => apt.status !== 'cancelled').length
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Welcome, Dr. {user?.name.split(' ')[1]}</h2>
          <p className="mt-1 text-sm text-gray-600">
            Here's an overview of your appointments and patient schedule.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <div className="bg-blue-50 rounded-lg p-5 flex flex-col">
            <div className="flex items-center text-blue-700 mb-2">
              <Calendar size={20} className="mr-2" />
              <h3 className="font-semibold">Today's Appointments</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{appointmentCounts.today}</p>
            <p className="text-sm text-gray-600 mt-1">Scheduled for today</p>
            <div className="mt-auto pt-4">
              <Link 
                to="/doctor/appointments"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
              >
                View today's schedule
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-5 flex flex-col">
            <div className="flex items-center text-green-700 mb-2">
              <User size={20} className="mr-2" />
              <h3 className="font-semibold">Upcoming Appointments</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{appointmentCounts.upcoming}</p>
            <p className="text-sm text-gray-600 mt-1">Future scheduled</p>
            <div className="mt-auto pt-4">
              <Link 
                to="/doctor/appointments"
                className="text-green-600 hover:text-green-800 text-sm font-medium inline-flex items-center"
              >
                View all appointments
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-5 flex flex-col">
            <div className="flex items-center text-purple-700 mb-2">
              <Stethoscope size={20} className="mr-2" />
              <h3 className="font-semibold">Your Schedule</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{appointmentCounts.total}</p>
            <p className="text-sm text-gray-600 mt-1">Total active appointments</p>
            <div className="mt-auto pt-4">
              <Link 
                to="#"
                className="text-purple-600 hover:text-purple-800 text-sm font-medium inline-flex items-center"
              >
                Manage availability
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
          <h2 className="text-lg font-semibold text-gray-800">Today's Schedule</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">
              Loading today's appointments...
            </div>
          ) : todayAppointments.length > 0 ? (
            todayAppointments.map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div className="mb-4 sm:mb-0">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{appointment.patientName}</h3>
                        <span className="ml-2">
                          {getStatusBadge(appointment.status)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Clock size={16} className="mr-1 text-gray-400" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Link
                      to={`/doctor/patient-records/${appointment.patientId}`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Records
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-500">You don't have any appointments scheduled for today.</p>
              <Link
                to="/doctor/appointments"
                className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
              >
                View all appointments
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">
              Loading upcoming appointments...
            </div>
          ) : upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div className="mb-4 sm:mb-0">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{appointment.patientName}</h3>
                        <span className="ml-2">
                          {getStatusBadge(appointment.status)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Calendar size={16} className="mr-1 text-gray-400" />
                      <span>{new Date(appointment.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                      <span className="mx-2">•</span>
                      <Clock size={16} className="mr-1 text-gray-400" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Link
                      to={`/doctor/patient-records/${appointment.patientId}`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Records
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-500">You don't have any upcoming appointments scheduled.</p>
            </div>
          )}
          
          {upcomingAppointments.length > 0 && (
            <div className="p-4 text-center">
              <Link
                to="/doctor/appointments"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View all appointments
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;