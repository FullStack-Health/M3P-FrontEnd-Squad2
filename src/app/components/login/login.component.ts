import { Component, TemplateRef, inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { CustomValidatorService } from '../../services/custom-validator.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgbAlert],
  providers: [CustomValidatorService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {

  constructor(
    private customValidatorService: CustomValidatorService,
    private router: Router,
    private toastrService: ToastrService,
    private userService: UserService,
  ) { };

  private modalService = inject(NgbModal);
  private modalRef: any;

  alertLoginVisibility: boolean = false;
  alertSignupVisibility: boolean = false;
  alertMessage: string = '';
  alertType: string = '';

  loginInfo = new FormGroup({
    userEmail: new FormControl(''),
    userPassword: new FormControl(''),
  });

  signupInfo = new FormGroup({
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    userProfile: new FormControl('', [Validators.required]),
    userPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  openModal(content: TemplateRef<any>) {
    this.modalRef = this.modalService.open(content, { centered: true });
    this.alertLoginVisibility = false;
  };

  closeModal(reason: string) {
    this.modalRef.dismiss(reason);
    this.alertSignupVisibility = false;
  };

  showLoginAlert(message: string, type: string) {
    this.alertType = type;
    this.alertMessage = message;
    this.alertLoginVisibility = true;
    setTimeout(() => {
      this.alertLoginVisibility = false;
    }, 15000);
  };

  closeAlert() {
    this.alertLoginVisibility = false;
  };

  showSignupAlert(message: string, type: string) {
    this.alertType = type;
    this.alertMessage = message;
    this.alertSignupVisibility = true;
    setTimeout(() => {
      this.alertSignupVisibility = false;
    }, 15000);
  };

  login() {
    if (this.loginInfo.value.userEmail && this.loginInfo.value.userPassword) {
      this.setLoggedUser(this.loginInfo.value.userEmail);
      this.toastrService.success("Login efetuado com sucesso!",'');
      this.router.navigate(["home"]);
    } else {
      this.showLoginAlert("Por favor, preencha todos os campos.", "warning");
    };
  };

  checkEmail(email: string) {
    let users = this.getStorage();
    return users.find((user: { email: string | null | undefined; }) => user.email == email);
  };

  setLoggedUser(email: string) {
    let loggedUser = this.checkEmail(email);
    localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
  };

  signup() {
    if (!this.signupInfo.value.userEmail || !this.signupInfo.value.userProfile || !this.signupInfo.value.userPassword || !this.signupInfo.value.confirmPassword) {
      this.showSignupAlert("Preencha todos os campos.", "warning");
      return;
    }
    if (this.signupInfo.value.userPassword != this.signupInfo.value.confirmPassword) {
      this.showSignupAlert("Os campos senha e confirmar senha devem ser iguais.", "warning");
      return;
    }
    if (!this.signupInfo.valid) {
      this.showSignupAlert("Os campos não foram preenchidos adequadamente.", "danger");
      return;
    }
    this.addUser(this.signupInfo.value.userEmail, this.signupInfo.value.userProfile, this.signupInfo.value.userPassword);
  };

  addUser(email: string, profile: string, password: string) {
    const newUser = {
      email: email,
      profile : profile,
      password: password,
    };
    this.userService.addQuickUser(newUser).subscribe({
      next: (response): void => {
        this.toastrService.success('Novo registro de pessoa usuária salvo com sucesso!', '');
        this.showLoginAlert(`O cadastro da pessoa com o e-mail ${email} foi realizado com sucesso!`, "success");
        this.signupInfo.reset();
        this.closeModal("Submit click");
      },
      //TO DO: (Depende do back-end, endpoint POST /usuarios/pre-registro) Atualizar a mensagem abaixo para mostrar a mensagem de retorno do back-end.
      error: (error) => {
        this.toastrService.error('Algo deu errado ao tentar salvar o registro de pessoa usuária.', '');
      }});
  
  };

  getStorage() {
    const emptyDatabase: string[] = [];
    const users = localStorage.getItem("users");
    if (!!users) {
      return JSON.parse(users);
    } else {
      localStorage.setItem("users", JSON.stringify(emptyDatabase));
      return [];
    };
  };

  forgotPassword() {
    if (this.loginInfo.value.userEmail) {
      let userFound = this.checkEmail(this.loginInfo.value.userEmail);
      if (userFound) {
        let users = this.getStorage();
        const updatedUsers = users.map((user: { email: any; }) => {
          if (user.email === userFound.email) {
            return { ...user, password: "novasenha" };
          }
          return user;
        });
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        this.toastrService.info("Sua senha foi alterada para a senha padrão ‘novasenha’. Faça seu login utilizando essa senha.")
      } else {
        this.toastrService.warning("Pessoa usuária não cadastrada.")
      }
    } else {
      this.toastrService.warning("Preencha o campo e-mail.")
    };
  };

}
