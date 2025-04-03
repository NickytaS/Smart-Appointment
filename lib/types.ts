export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface Doctor {
  id: string; // Adjust the type based on your database schema
  first_name: string;
  last_name: string;
  title: string;
  bio: string;
  avatar: string;
  specialty_id: string;
  rating: number;
  reviews_count: number;
  is_available: boolean;
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  isVideo: boolean;
  location: string;
  status: string;
  avatar: string; // Added the missing avatar property
}
