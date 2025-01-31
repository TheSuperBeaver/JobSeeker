import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { JobStatus } from '../../models/job.status';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { MatButtonModule } from '@angular/material/button';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/users';

@Component({
  selector: 'job-filter',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, CommonModule, MarkdownModule, MatButtonModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class JobFilterComponent {

  readonly jobStatusList = [
    { value: JobStatus.New, label: 'New', icon: 'fas fa-plus-circle', style: 'badge-new' },
    { value: JobStatus.Viewed, label: 'Viewed', icon: 'fas fa-eye', style: 'badge-viewed' },
    { value: JobStatus.Starred, label: 'Starred', icon: 'fas fa-star', style: 'badge-starred' },
    { value: JobStatus.Hidden, label: 'Hidden', icon: 'fas fa-eye-slash', style: 'badge-hidden' },
  ];
  loaded: boolean = false;
  canViewOtherUsers: boolean = false;
  users: User[] = [];
  usersService!: UsersService;

  @Output() jobStatusChange = new EventEmitter<string[]>();
  @Output() userChange = new EventEmitter<number>();

  jobStatuses = new FormControl<string[]>(['New', 'Viewed', 'Starred']);
  userChoosen = new FormControl<number>(0);

  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  ngOnInit(): void {
    this.loadUsers();
    this.usersService.canViewOtherUsers$.subscribe((canView) => {
      this.canViewOtherUsers = canView;
    });
  }

  async loadUsers(): Promise<void> {
    this.loaded = false;
    this.users = [];
    try {
      this.usersService.loadUsers().then(() => {
        this.users = this.usersService.users
        this.loaded = true
        this.userChoosen.setValue(this.users[0].id)
        let connectedUserEmail = localStorage.getItem('email')

        if (connectedUserEmail) {
          const userExists = this.users.some(user => user.email === connectedUserEmail);

          if (!userExists) {
            this.users.push({ id: 0, email: connectedUserEmail, capyx_id: 0, role_id: 4 });
          }
        }
        return Promise.resolve()
      })
    } catch (error) {
      console.error('Failed to load users.', error);
      return Promise.reject();
    }
  }

  onStatusChange(): void {
    this.jobStatusChange.emit(this.jobStatuses.value || []);
  }

  onUserChange(): void {
    this.userChange.emit(this.userChoosen.value || 0);
  }
}
