import { Component, inject } from '@angular/core';
import { FileUploaderComponent } from '../../components/shared/file-uploader/file-uploader.component';
import { UploaderService } from '../../services/cloudinary/uploader.service';
import { AlertService } from '../../services/alert.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FileUploaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  public uploaderService: UploaderService = inject(UploaderService);
  public alertService: AlertService = inject(AlertService);

  onFileUpload(files: File[]) {
    try {
      const folderName = 'multiples-archivos'; 
      this.uploaderService.uploadFiles(files, folderName);
    } catch (err) {
      console.error('❌ Error inesperado al subir:', err);
      this.alertService.displayAlert(
        'error',
        'Ocurrió un error inesperado al subir el archivo.',
        'center',
        'top',
        ['error-snackbar']
      );
    }
  }
}
