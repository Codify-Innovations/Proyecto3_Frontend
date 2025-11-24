import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { IUser } from '../../../core/interfaces';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  public fb: FormBuilder = inject(FormBuilder);

  @Input() userForm!: FormGroup;
  @Input() isEditMode: boolean = false;

  @Output() callSaveMethod: EventEmitter<IUser> = new EventEmitter<IUser>();
  @Output() callUpdateMethod: EventEmitter<IUser> = new EventEmitter<IUser>();

  callSave() {
    let user: IUser = {
      email: this.userForm.controls['email'].value,
      name: this.userForm.controls['name'].value,
      lastname: this.userForm.controls['lastname'].value,
      updatedAt: this.userForm.controls['updatedAt'].value
    };
  
    if (!this.isEditMode) {
      user.password = this.userForm.controls['password'].value;
    }
  
    if (this.userForm.controls['id'].value) {
      user.id = this.userForm.controls['id'].value;
    }
  
    if (this.isEditMode) {
      this.callUpdateMethod.emit(user);
    } else {
      this.callSaveMethod.emit(user);
    }
  } 
}
