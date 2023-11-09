import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Admin } from 'src/app/clases/admin';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { UserService } from 'src/app/servicios/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private authService: FirebaseService, private router: Router) {}
  ngOnInit(): void {}
}
