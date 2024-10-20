import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@NgModule({
  declarations: [ToolbarComponent,SidemenuComponent, ConfirmDialogComponent],
  imports: [CommonModule, FontAwesomeModule, RouterLink, NgbDropdownModule, NgxMaskDirective, NgxMaskPipe],
  exports: [ToolbarComponent,SidemenuComponent, ConfirmDialogComponent],
  providers: [provideNgxMask()]
})
export class SharedModule { }
