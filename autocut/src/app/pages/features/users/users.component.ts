import { Component, inject, ViewChild } from '@angular/core';
import { UserListComponent } from '../../../components/user/user-list/user-list.component';
import { UserFormComponent } from '../../../components/user/user-from/user-form.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { ModalComponent } from '../../../components/modal/modal.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { UserService } from '../../features/users/user.service';
import { ModalService } from '../../../core/services/modal.service';
import { FormBuilder, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { IUser } from '../../../core/interfaces';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    UserListComponent,
    PaginationComponent,
    ModalComponent,
    LoaderComponent,
    UserFormComponent,
    FormsModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  public userService: UserService = inject(UserService);
  public modalService: ModalService = inject(ModalService);
  @ViewChild('addUsersModal') public addUsersModal: any;

  public fb: FormBuilder = inject(FormBuilder);
  public isEditMode: boolean = false;

  userForm = this.fb.group({
    id: [''],
    email: ['', Validators.required],
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    password: ['', Validators.required],
    updatedAt: [''],
  });

  public filters = {
    name: '',
    email: '',
    active: ''
  };

  constructor() {
    this.userService.search.page = 1;
    this.userService.getAll();
  }

  saveUser(user: IUser) {
    this.userService.save(user);
    this.modalService.closeAll();
  }

  callEdition(user: IUser) {
    this.isEditMode = true;

    this.userForm.controls['id'].setValue(user.id ? String(user.id) : '');
    this.userForm.controls['email'].setValue(user.email || '');
    this.userForm.controls['name'].setValue(user.name || '');
    this.userForm.controls['lastname'].setValue(user.lastname || '');
    this.userForm.controls['updatedAt'].setValue(user.updatedAt || '');

    this.userForm.controls['password'].setValue('');
    this.userForm.controls['password'].clearValidators();
    this.userForm.controls['password'].updateValueAndValidity();

    this.modalService.displayModal('md', this.addUsersModal);
  }

  updateUser(user: IUser) {
    this.userService.update(user);
    this.modalService.closeAll();
  }

  createUserModal() {
    this.isEditMode = false;
    this.userForm.reset();
    this.userForm.controls['password'].setValidators(Validators.required);
    this.userForm.controls['password'].updateValueAndValidity();
    this.modalService.displayModal('md', this.addUsersModal);
  }

  applyFilters() {
    const params: any = {
      page: this.userService.search.page,
      size: this.userService.search.size
    };

    if (this.filters.name.trim()) params.name = this.filters.name.trim();
    if (this.filters.email.trim()) params.email = this.filters.email.trim();
    if (this.filters.active !== '') params.active = this.filters.active;

    this.userService.searchUsers(params);
  }

  deleteUser(user: IUser) {
    if (!user?.id) return;
    this.userService.delete(user);
  }
}
