import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model'; // Assuming you have a Contact model
import { AsyncPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'contactly.web';
  http = inject(HttpClient);

  contactsForm = new FormGroup({
    name: new FormControl<string>(''),
    email: new FormControl<string | null>(null),
    phone: new FormControl<string>(''),
    favorite: new FormControl<boolean>(false),
  });

  contacts$ = this.getContacts();

  OnFormSubmit() {
    const addContactRequest = {
      name: this.contactsForm.value.name,
      email: this.contactsForm.value.email,
      phone: this.contactsForm.value.phone,
      favorite: this.contactsForm.value.favorite,
    };

    this.http
      .post('https://localhost:7281/api/Contacts', addContactRequest)
      .subscribe({
        next: (value) => {
          console.log(value);
          this.contactsForm.reset();
          this.contacts$ = this.getContacts();
        },
      });
  }

  onDelete(id: string): void {
    this.http.delete(`https://localhost:7281/api/Contacts/${id}`).subscribe({
      next: (value) => {
        alert('Item deleted');
        this.contacts$ = this.getContacts();
      },
      error: (err) => {
        if (err.status === 404) {
          alert('Contact not found');
        } else {
          console.error('Error deleting item:', err);
          alert('Failed to delete item');
        }
      },
    });
  }

  private getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>('https://localhost:7281/api/Contacts');
  }
}
