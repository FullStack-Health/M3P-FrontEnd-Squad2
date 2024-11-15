import { CommonModule, formatDate, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PatientService } from '../../services/patient.service';
import { BirthDatePipe } from '../../pipes/birth-date.pipe';
import { ExamService } from '../../services/exam.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleChevronLeft, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, BirthDatePipe, FontAwesomeModule],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.scss'
})
export class ExamComponent {

  constructor (
    private toastrService: ToastrService,
    private patientService: PatientService,
    private examService: ExamService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private confirmDialogService: ConfirmDialogService,
  ) {}

  patientInput = new FormGroup({
    nameOrId: new FormControl('')
  });

  patientsList: any = [];
  resultsList: any = [];

  selectedPatientName: string = "";
  selectedPatientId: string = "";

  examInfo = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]),
    date: new FormControl(formatDate(new Date(), 'yyyy-MM-dd', "en"), [Validators.required]),
    time: new FormControl(formatDate(new Date(), 'HH:mm', "en"), [Validators.required]),
    type: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(32)]),
    laboratory: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(32)]),
    documentUrl: new FormControl(''),
    results: new FormControl('', [Validators.required, Validators.minLength(16), Validators.maxLength(1024)]),
  });

  editingMode = false;
  examToEdit: any = {};

  faCircleChevronLeft = faCircleChevronLeft;
  faPenToSquare = faPenToSquare;

  ngOnInit() {
    this.activatedRoute.params.subscribe((parameters) => {
      let examId = parameters['id'];
      if (examId) {
        this.editingMode = true;
        this.getExam(examId);
      }
      else {
        this.editingMode = false;
      }
    });
  };

  getExam(examId: string) {
    this.examService.getExam().subscribe((exams) => {
      this.examToEdit = exams.content.find((exam: { id: number; }) => exam.id === Number(examId));
      this.examInfo.patchValue({
        name: this.examToEdit.nome,
        date: this.examToEdit.dataExame,
        time: this.examToEdit.horaExame,
        type: this.examToEdit.tipo,
        laboratory: this.examToEdit.laboratorio,
        documentUrl: this.examToEdit.url,
        results: this.examToEdit.resultados,
        });
      this.selectedPatientId = this.examToEdit.paciente?.id;
      this.selectedPatientName = this.examToEdit.paciente?.name;
   
    });
  };

  searchPatient() {
    const nameOrId = this.patientInput.value.nameOrId?.trim();

    if (nameOrId) {
      this.patientService.getPatient().subscribe((patients) => {

        this.patientsList = patients.content;
        this.resultsList = this.patientsList.filter((searchedPatient: any) => {
          const isNameMatch = searchedPatient.name?.toLowerCase().includes(nameOrId.toLowerCase());
          const isIdMatch = searchedPatient.id?.toString() ===nameOrId;          
          return isNameMatch || isIdMatch;
        });
 
        this.resultsList.sort((a: any,b: any) => a.name.localeCompare(b.name));
        if (this.resultsList.length === 0) {
          this.toastrService.error("Não foram encontrados registros de paciente com este nome ou código de registro.");
        }
      });
    } else {
      this.toastrService.warning("Preencha nome ou identificador no campo de busca.");
    }
  };

  selectPatient(name: string, id: string) {
    this.toastrService.info("Você selecionou " + name);
    this.selectedPatientName = name;
    this.selectedPatientId = id;
    this.resultsList = [];
  }

  saveExam() {
    if (!!this.selectedPatientId) {
      if (this.examInfo.valid) {
        const newExam = {
          "patientId": this.selectedPatientId,
          "nome": this.examInfo.value.name,
          "dataExame": this.examInfo.value.date,
          "horaExame": this.examInfo.value.time,
          "tipo": this.examInfo.value.type,
          "laboratorio": this.examInfo.value.laboratory,
          "url": this.examInfo.value.documentUrl,
          "resultados": this.examInfo.value.results,
        }
        this.examService.addExam(newExam).subscribe({
          next: (response): void => {
            this.examInfo.reset();
            this.examInfo.get('date')?.setValue(formatDate(new Date(), 'yyyy-MM-dd', 'en'));
            this.examInfo.get('time')?.setValue(formatDate(new Date(), 'HH:mm', 'en'));
            this.toastrService.success('Novo exame salvo com sucesso!', '');
          },
          error: (error) => {
            this.toastrService.error('Algo deu errado ao tentar salvar o novo exame.', '');
          }
        });
      } else {
        this.toastrService.warning("Preencha todos os campos obrigatórios corretamente.");
      }
    } else {
      this.toastrService.warning("Selecione um registro de paciente para vincular a este exame.");
    }
  };

  editExam() {
    if (this.examInfo.valid) {
      const editedExam = {
        "patientId": this.selectedPatientId,
        "nome": this.examInfo.value.name,
        "dataExame": this.examInfo.value.date,
        "horaExame": this.examInfo.value.time,
        "tipo": this.examInfo.value.type,
        "laboratorio": this.examInfo.value.laboratory,
        "url": this.examInfo.value.documentUrl,
        "resultados": this.examInfo.value.results,
      }
      this.examService.editExam(this.examToEdit.id, editedExam).subscribe({
        next: (response): void => {
          this.toastrService.success('Exame alterado com sucesso!', '');
          this.location.back();
        },
        error: (error) => {
          this.toastrService.error('Algo deu errado ao tentar editar o exame.', '');
        }
      });
    } else {
      this.toastrService.warning("Preencha todos os campos obrigatórios corretamente.");
    }
};  

deleteExam() {
  this.confirmDialogService.confirm('Confirmar', 'Você deseja realmente apagar este exame? Esta ação é irreversível.', "Sim", "Cancelar")
  .then((confirmed) => {
    if (confirmed) {
      this.examService.deleteExam(this.examToEdit.id).subscribe({
        next: (response): void => {
          this.toastrService.success('Exame apagado com sucesso!', '');
          this.location.back();
        },
        error: (error) => {
          this.toastrService.error('Algo deu errado ao tentar apagar o exame.', '');
        }
      })
    };
  })
  .catch((error) => {});
};


  goBack() {
    this.location.back();
    };

}
