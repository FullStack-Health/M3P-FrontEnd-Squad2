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
  ) {
    localStorage.clear();
  };

  private modalService = inject(NgbModal);
  private modalRef: any;

  alertLoginVisibility: boolean = false;
  alertModalVisibility: boolean = false;
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

  forgotPasswordInfo = new FormGroup({
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmNewPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  openModal(content: TemplateRef<any>) {
    this.modalRef = this.modalService.open(content, { centered: true });
    this.alertLoginVisibility = false;
  };

  closeModal(reason: string) {
    this.modalRef.dismiss(reason);
    this.alertModalVisibility = false;
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
    this.alertModalVisibility = true;
    setTimeout(() => {
      this.alertModalVisibility = false;
    }, 15000);
  };

  login() {
    if (this.loginInfo.value.userEmail && this.loginInfo.value.userPassword) {
      const userEmail = this.loginInfo.value.userEmail;
      this.userService.login({
        username: this.loginInfo.value.userEmail,
        password: this.loginInfo.value.userPassword
      }).then((token: any) => {
        this.setTokenUser(token);
        this.userService.me().then((user) => {
          this.setLoggedUser(user);
          this.router.navigate(["home"]);
          this.toastrService.success("Login efetuado com sucesso!", '');
        });
      }).catch((err) => {
        this.toastrService.error("Login não efetuado, favor confirme os dados digitados!", '');
      })
    } else {
      this.showLoginAlert("Por favor, preencha todos os campos.", "warning");
    };
  };

  checkEmail(email: string) {
    let users = this.getStorage();
    return users.find((user: { email: string | null | undefined; }) => user.email == email);
  };

  setTokenUser(token: string) {
    localStorage.setItem("access_token", token);
  };

  setLoggedUser(user: any) {
    // let loggedUser = this.checkEmail(email);
    localStorage.setItem("loggedUser", JSON.stringify(user));
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
    this.alertModalVisibility = false;
  };

  addUser(email: string, profile: string, password: string) {
    const newUser = {
      email: email,
      profile: profile,
      password: password,
    };
    this.userService.addQuickUser(newUser).subscribe({
      next: (response): void => {
        this.toastrService.success('Novo registro de pessoa usuária salvo com sucesso!', '');
        this.showLoginAlert(`O cadastro da pessoa com o e-mail ${email} foi realizado com sucesso!`, "success");
        this.signupInfo.reset();
        this.closeModal("Submit click");
      },
      //TO DO: (Depende do back-end, endpoint POST /usuarios/pre-registro) Garantir que a mensagem abaixo está específica e amigável à pessoa usuária.
      error: (error) => {
        this.toastrService.error(error.message, '');
      }
    });
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

  redefinePassword() {
    if (!this.forgotPasswordInfo.value.userEmail || !this.forgotPasswordInfo.value.newPassword || !this.forgotPasswordInfo.value.confirmNewPassword) {
      this.showSignupAlert("Preencha todos os campos.", "warning");
      return;
    };
    if (this.forgotPasswordInfo.value.newPassword != this.forgotPasswordInfo.value.confirmNewPassword) {
      this.showSignupAlert("Os campos senha e confirmar senha devem ser iguais.", "warning");
      return;
    };
    if (!this.forgotPasswordInfo.valid) {
      this.showSignupAlert("Os campos não foram preenchidos adequadamente.", "danger");
      return;
    };
    this.changePassword(this.forgotPasswordInfo.value.userEmail, this.forgotPasswordInfo.value.newPassword);
    this.alertModalVisibility = false;
  };

  changePassword(email: string, newPassword: string) {
    this.userService.changePassword(email, newPassword).subscribe({
      next: (response): void => {
        this.toastrService.success('Sua senha foi alterada com sucesso!', '');
        this.showLoginAlert(`A senha da pessoa com o e-mail ${email} foi alterada com sucesso.`, "success");
        this.forgotPasswordInfo.reset();
        this.closeModal("Submit click");
      },
      //TO DO: (Depende do back-end, endpoint PUT /usuarios/email/{email}/redefinir-senha) Garantir que a mensagem abaixo está específica e amigável à pessoa usuária.
      error: (error) => {
        this.toastrService.error(error.message, '');
      }

    });
  };




}
