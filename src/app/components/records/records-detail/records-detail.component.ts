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
import { ToastrService } from 'ngx-toastr';
import { forkJoin, catchError, of } from 'rxjs';

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
    private toastrService: ToastrService,
  ) { }

  forkJoin: any = forkJoin;

  patientId: string = "";
  patient: any = {};
  patientEvents: any = [];
  userPatient: boolean = false;

  faCalendarDay = faCalendarDay;
  faClock = faClock;
  faStethoscope = faStethoscope;
  faMicroscope = faMicroscope;
  faPaperclip = faPaperclip;

ngOnInit() {
  this.getLoggedUser();

  this.activatedRoute.params.subscribe((parameters) => {
    this.patientId = parameters['id'];
    this.patientService.getPatientPronturario(this.patientId).subscribe({
      next: (patient) => {
        this.patient = patient;

        forkJoin({
          consultations: this.consultationService.getConsultation().pipe(
            catchError(error => {
              return of({ content: [] }); 
            })
          ),
          exams: this.examService.getExam().pipe(
            catchError(error => {
              return of({ content: [] }); 
            })
          )
        }).subscribe({
          next: ({ consultations, exams }) => {
            const patientConsultations = consultations.content ? consultations.content.filter((consultation: { patient: { id: string } }) => {
              return consultation.patient && consultation.patient.id.toString() === this.patientId.toString();
            }).map((consultation: any) => {
              consultation.datetime = new Date(consultation.date + 'T' + consultation.time);
              return consultation;
            }) : [];

            const patientExams = exams.content ? exams.content.filter((exam: { paciente: { id: string } }) => {
              return exam.paciente && exam.paciente.id.toString() === this.patientId.toString();
            }).map((exam: any) => {
              exam.datetime = new Date(exam.dataExame + 'T' + exam.horaExame);
              return exam;
            }) : [];

            this.patientEvents = [...patientConsultations, ...patientExams];
            this.patientEvents.sort((a: any, b: any) => b.datetime.getTime() - a.datetime.getTime());

          },
          error: (error) => this.toastrService.error('Não foi possível carregar exames ou consultas:', error.error)
        });
      },
      error: (error) => this.toastrService.error('Não foi possível carregar paciente:', error.error)
    });
  });
};

  getLoggedUser() {
    const user = localStorage.getItem("loggedUser");
    if (user) {
      const parsedUser = JSON.parse(user);
      const perfil = parsedUser.perfil;
      this.userPatient = perfil === "PACIENTE";
    };
  }

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
