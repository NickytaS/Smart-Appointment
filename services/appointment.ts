import { supabase } from "../lib/supabase"
import { Alert } from "react-native"

export type Doctor = {
  id: string
  name: string
  specialty: string
  image: string
  rating: number
  location: string
}

export type Appointment = {
  id: string
  user_id: string
  doctor_id: string
  doctor: Doctor
  appointment_type: string
  date: string
  time: string
  location: string
  status: "confirmed" | "pending" | "completed" | "cancelled"
  created_at: string
}

export const fetchDoctors = async (): Promise<Doctor[]> => {
  try {
    const { data, error } = await supabase.from("doctors").select("*").order("name")

    if (error) {
      throw error
    }

    return data || []
  } catch (error: any) {
    Alert.alert("Error", "Failed to fetch doctors: " + error.message)
    return []
  }
}

export const fetchDoctorsBySpecialty = async (specialty: string): Promise<Doctor[]> => {
  try {
    const { data, error } = await supabase.from("doctors").select("*").eq("specialty", specialty).order("name")

    if (error) {
      throw error
    }

    return data || []
  } catch (error: any) {
    Alert.alert("Error", "Failed to fetch doctors: " + error.message)
    return []
  }
}

export const fetchAppointments = async (userId: string, status?: string): Promise<Appointment[]> => {
  try {
    let query = supabase
      .from("appointments")
      .select(`
        *,
        doctor:doctor_id (*)
      `)
      .eq("user_id", userId)

    if (status) {
      if (status === "upcoming") {
        query = query.in("status", ["confirmed", "pending"])
      } else if (status === "past") {
        query = query.in("status", ["completed", "cancelled"])
      } else {
        query = query.eq("status", status)
      }
    }

    const { data, error } = await query.order("date", { ascending: true })

    if (error) {
      throw error
    }

    return data || []
  } catch (error: any) {
    Alert.alert("Error", "Failed to fetch appointments: " + error.message)
    return []
  }
}

export const createAppointment = async (
  appointment: Omit<Appointment, "id" | "created_at">,
): Promise<Appointment | null> => {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .insert([
        {
          ...appointment,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error: any) {
    Alert.alert("Error", "Failed to create appointment: " + error.message)
    return null
  }
}

export const updateAppointmentStatus = async (
  appointmentId: string,
  status: Appointment["status"],
): Promise<boolean> => {
  try {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", appointmentId)

    if (error) {
      throw error
    }

    return true
  } catch (error: any) {
    Alert.alert("Error", "Failed to update appointment: " + error.message)
    return false
  }
}

export const fetchSpecialties = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase.from("specialties").select("name").order("name")

    if (error) {
      throw error
    }

    return data.map((item) => item.name) || []
  } catch (error: any) {
    Alert.alert("Error", "Failed to fetch specialties: " + error.message)
    return []
  }
}

export const fetchSpecialty = async (specialty: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.from("specialties").select("name").eq("name", specialty)

    if (error) {
      throw error
    }

    return data?.[0]?.name || null
  } catch (error: any) {
    Alert.alert("Error", "Failed to fetch specialty: " + error.message)
    return null
  }
}