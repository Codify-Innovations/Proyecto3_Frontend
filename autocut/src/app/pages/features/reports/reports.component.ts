import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportHistoryComponent } from '../../../components/report-history/report-history.component';
import { ReportsHistoryService } from '../../../core/services/reports-history.service';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [CommonModule, ReportHistoryComponent],
  templateUrl: './reports.component.html',
})
export class ReportsComponent implements OnInit {

  reportsHistoryService = inject(ReportsHistoryService);

  ngOnInit(): void {
    this.reportsHistoryService.loadHistory();
  }

  get historial() {
    return this.reportsHistoryService.historial();
  }

  get loading() {
    return this.reportsHistoryService.loading();
  }
}
