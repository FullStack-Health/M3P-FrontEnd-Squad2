import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faCircleInfo, faUserPlus, faStethoscope, faMicroscope, faClipboardUser, faDoorOpen, faSquareCaretLeft, faSquareCaretRight, faUsersGear } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { PatientService } from '../../../services/patient.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss',
})
export class SidemenuComponent {

  constructor (
    private router: Router,
    private toastrService: ToastrService,
    private patientService: PatientService,
  ) {};

  expanded = true;

  userPatient: boolean = false;
  userAdmin: boolean = false;
  userDoctor: boolean = false;

  patientId: number = 0;

  faCircleInfo = faCircleInfo;
  faUserPlus = faUserPlus;
  faStethoscope = faStethoscope;
  faMicroscope = faMicroscope;
  faClipboardUser = faClipboardUser;
  faDoorOpen = faDoorOpen;
  faSquareCaretLeft = faSquareCaretLeft;
  faSquareCaretRight = faSquareCaretRight;
  faUsersGear = faUsersGear;

  ngOnInit(): void {
    const user = localStorage.getItem("loggedUser");
    if (user) {
        const parsedUser = JSON.parse(user);
        const perfil = parsedUser.perfil;
        this.userAdmin = perfil === "ADMIN";
        this.userDoctor = perfil === "MEDICO";
        this.userPatient = perfil === "PACIENTE";

        //TODO: Atualizar patientId com o Id da pessoa paciente logada (aqui está o id de usuária, não é esse)
        //Problema: a pessoa paciente só tem acesso ao GET pacientes/id dela, mas qual o id dela?
        if (this.userPatient) {
              this.patientId = parsedUser.id;
              console.log(this.patientId);
        };
    };   
  };

  logout(){
    localStorage.setItem("loggedUser", JSON.stringify(""));
    this.toastrService.success("Logout realizado com sucesso.", '')
    this.router.navigate(["login"]);;
  };

}
