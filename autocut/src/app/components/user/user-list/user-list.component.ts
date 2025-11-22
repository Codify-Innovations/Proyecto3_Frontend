import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IUser } from '../../../core/interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../pages/features/users/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  @Input() title: string = '';
  @Input() users: IUser[] = [];

  @Output() callModalAction = new EventEmitter<IUser>();
  @Output() callDeleteAction = new EventEmitter<IUser>();

  constructor(private userService: UserService) {}

  openEdit(user: IUser) {
    this.callModalAction.emit(user);
  }

  deleteUser(user: IUser) {
    this.callDeleteAction.emit(user);
  }

  onStatusChange(user: IUser) {
    if (!user?.id) return;

    const id = user.id;

    if (user.active === true) {
      this.userService.activate(id).subscribe({
        next: () => this.userService.getAll()
      });
    } else {
      this.userService.deactivate(id).subscribe({
        next: () => this.userService.getAll()
      });
    }
  }
}
