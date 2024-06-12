import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

import { HeaderRoutingModule } from './header-routing.module';
import { HeaderComponent } from './components/header.component'; 


@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    HeaderRoutingModule
  ],
  exports:[HeaderComponent]
})
export class HeaderModule { }
