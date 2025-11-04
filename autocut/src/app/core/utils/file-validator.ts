import { AlertService } from '../../core/services/alert.service';

/**
 * Valida un archivo según tipo y tamaño permitido.
 * @param files Lista de archivos a validar
 * @param alertService Servicio de alertas (para mostrar mensajes al usuario)
 * @returns true si el archivo es válido, false si no lo es
 */

export function validateFiles(
  files: File[],
  alertService: AlertService
): boolean {
  let isValid = true;

  if (!files) {
    alertService.displayAlert(
      'error',
      'No se seleccionó ningún archivo.',
      'center',
      'top',
      ['error-snackbar']
    );
    return false;
  }

  files.forEach((file) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const isAudio = file.type.startsWith('audio/');

    if (!isImage && !isVideo && !isAudio) {
      alertService.displayAlert(
        'error',
        `El archivo ${file.name} tiene un tipo no permitido. Solo se aceptan imágenes, videos o audios.`,
        'center',
        'top',
        ['error-snackbar']
      );
      isValid = false;
    }

    if (isImage && file.size > 10 * 1024 * 1024) {
      alertService.displayAlert(
        'error',
        `La imagen ${file.name} supera el tamaño máximo permitido (10MB).`,
        'center',
        'top',
        ['error-snackbar']
      );
      isValid = false;
    }

    if ((isVideo || isAudio) && file.size > 100 * 1024 * 1024) {
      alertService.displayAlert(
        'error',
        `El archivo ${file.name} supera el tamaño máximo permitido (100MB).`,
        'center',
        'top',
        ['error-snackbar']
      );
      isValid = false;
    }
  });

  return isValid;
}
