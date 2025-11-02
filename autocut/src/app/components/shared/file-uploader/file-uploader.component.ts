import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, inject, Output } from '@angular/core';
import { validateFiles } from '../../../core/utils/file-validator';
import { AlertService } from '../../../services/alert.service';
import { UploaderService } from '../../../services/cloudinary/uploader.service';

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-uploader.component.html',
})
export class FileUploaderComponent {
  @Output() filesSelected = new EventEmitter<File[]>();

  public alertService: AlertService = inject(AlertService);
  public uploaderService: UploaderService = inject(UploaderService);
  private selectedFiles: File[] = [];
  dragging = false;
  fileNames: string[] = [];
  tooltipVisible: boolean = false;

  mostrarTooltip() {
    this.tooltipVisible = true;
  }

  ocultarTooltip() {
    this.tooltipVisible = false;
  }

  removeFile(index: number): void {
    this.fileNames.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  constructor() {
    effect(() => {
      if (this.uploaderService.uploaded$()) {
        this.fileNames = [];
        this.selectedFiles = [];
      }
    });
  }

  onFileChange(event: any) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.uploaderService.uploaded$.set(false);
    if (!files || files.length === 0) return;
    console.log(files);
    console.log(this.selectedFiles);
    const filesArray = Array.from(files);

    const isValid = validateFiles(filesArray, this.alertService);

    if (!isValid) {
      return;
    }

    filesArray.forEach((file) => {
      this.selectedFiles.push(file);
      this.fileNames.push(file.name);
    });
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragging = false;
    this.uploaderService.uploaded$.set(false);
    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;
    const filesArray = Array.from(files);
    console.log(files);
    console.log(this.selectedFiles);
    const isValid = validateFiles(filesArray, this.alertService);
    if (!isValid) {
      return;
    }

    filesArray.forEach((file) => {
      this.selectedFiles.push(file);
      this.fileNames.push(file.name);
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragging = true;
  }

  onDragLeave() {
    this.dragging = false;
  }

  onUploadClick() {
    if (this.selectedFiles.length === 0) {
      this.alertService.displayAlert(
        'error',
        'No hay archivos seleccionados para subir.',
        'center',
        'top',
        ['error-snackbar']
      );
      return;
    }
    this.filesSelected.emit(this.selectedFiles);
  }
}
