import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { ConsultationService } from '../../../services/consultation.service';
import { ExamService } from '../../../services/exam.service';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { PhonePipe } from '../../../pipes/phone.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendarDay, faClock, faStethoscope, faMicroscope, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { DateFormatInPipe } from '../../../pipes/date-format-in.pipe';

@Component({
  selector: 'app-records-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, PhonePipe, FontAwesomeModule, DateFormatInPipe],
  templateUrl: './records-detail.component.html',
  styleUrl: './records-detail.component.scss'
})
export class RecordsDetailComponent {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private patientService: PatientService,
    private consultationService: ConsultationService,
    private examService: ExamService,
  ) { }

  patientId: string = "";
  patient: any = {};
  patientEvents: any = [];

  faCalendarDay = faCalendarDay;
  faClock = faClock;
  faStethoscope = faStethoscope;
  faMicroscope = faMicroscope;
  faPaperclip = faPaperclip;

  ngOnInit() {
    this.activatedRoute.params.subscribe((parameters) => {
      this.patientId = parameters['id'];
      console.log("id do paciente vindo da lista: ",this.patientId);

      this.patientService.getPatientPronturario(this.patientId).subscribe((patient) => {
        
        this.patient = patient;
      });
    

      // this.patientService.getPatient().subscribe((patients) => {
      //   this.patient = patients.content.find((patient: { id: string; }) => patient.id == this.patientId);
      // });
       let patientConsultations: any[] = [];
      // this.consultationService.getConsultation().subscribe((consultations) => {
      //   patientConsultations = consultations.content.filter((consultation: { patientId: string; }) => consultation.patientId === this.patient.id);
      //   console.log("Id do paciente pro filtro", this.patientId);
      //   console.log("Todas consultas", consultations);
      //   console.log("Consultas paciente", patientConsultations );
        
        
        this.consultationService.getConsultation().subscribe((consultations) => {
          console.log("Consultations antes do filtro:", consultations.content);
        
          const patientConsultations = consultations.content.filter((consultation: { patient: { id: string } }) => {
           // console.log("Consulta patient.id:", consultation.patient?.id, "Filtro patientId:", this.patientId);
            return consultation.patient && consultation.patient.id.toString() === this.patientId.toString();
          });


        
        let patientExams = [];
         this.examService.getExam().subscribe((exams) => {
        //   console.log("Id vindo", this.patientId );
           console.log("exames do bd", exams.content);
        //   patientExams = exams.content.filter((exams: { patient: { id: string } }) => exams.patient.id == this.patientId);
       const patientExams = exams.content.filter((exam: { paciente: { id: string } }) => {
          console.log("Exam patient.id:", exam.paciente.id, "Filtro patientId:", this.patientId);
      
          // Verifica se exam.patient e exam.patient.id estão definidos antes de comparar
          return exam.paciente && exam.paciente.id.toString() === this.patientId.toString();
        });


          this.patientEvents = patientConsultations.concat(patientExams);
          
          // this.patientEvents.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
          // this.patientEvents.sort((a: any, b: any) => { // Use a data correta para ordenar 
          //   const dateA = a.date ? new Date(a.date).getTime() : new Date(a.dataExame).getTime(); 
          //   const dateB = b.date ? new Date(b.date).getTime() : new Date(b.dataExame).getTime(); 
          //   return dateA - dateB; 
          // });
          patientConsultations.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Ordenar exames cronologicamente 
          patientExams.sort((a: any, b: any) => new Date(b.dataExame).getTime() - new Date(a.dataExame).getTime()); // Concatenar consultas ordenadas e exames ordenados 
          this.patientEvents = [...patientConsultations, ...patientExams];


        });
      });
    });
  };

  editConsultation(id: string) {
    this.router.navigate(["edit-consultation", id]);
  };

  editExam(id: string) {
    this.router.navigate(["edit-exam", id]);
  };

  editPatient(id: string) {
    this.router.navigate(["edit-patient", id]);
  };


}
