package com.example.healthcarecrm.repository;

import com.example.healthcarecrm.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    boolean existsByDoctorAndAppointmentTime(Doctor doctor, LocalDateTime appointmentTime);

    boolean existsByPatientAndAppointmentTime(Patient patient, LocalDateTime appointmentTime);

    List<Appointment> findByDoctorIdAndStatusNot(Long doctorId, AppointmentStatus status);

    List<Appointment> findByPatientIdAndStatusNot(Long patientId, AppointmentStatus status);
}