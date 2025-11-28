import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-profile',
  standalone: true,
  imports: [CommonModule, UserProfileComponent],
  template: `
    <app-user-profile 
        [isVisitor]="true"
        [username]="username">
    </app-user-profile>
  `
})
export class PublicProfileComponent implements OnInit {

  username!: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username')!;
  }
}