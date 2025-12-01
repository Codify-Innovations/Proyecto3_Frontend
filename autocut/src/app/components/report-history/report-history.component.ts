import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsHistoryService } from '../../core/services/reports-history.service';
import { IReporteHistorial } from '../../core/interfaces';

@Component({
  selector: 'app-report-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-history.component.html',
})
export class ReportHistoryComponent  {
  @Input() historial: IReporteHistorial[] = [];
}
