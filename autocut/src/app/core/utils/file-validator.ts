import { AlertService } from '../../core/services/alert.service';

/**
 * Valida multiples archivos según tipo y tamaño permitido.
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

/**
 * Valida que se suba solo una imagen y cumpla con tamaño máximo.
 * @param files Archivos seleccionados
 * @param alertService Servicio de alertas
 * @returns true si el archivo es válido, false si no lo es
 */
export function validateSingleImage(
  files: File[],
  alertService: AlertService
): boolean {
  if (!files || files.length === 0) {
    alertService.displayAlert(
      'error',
      'Debes seleccionar una imagen para continuar.',
      'center',
      'top',
      ['error-snackbar']
    );
    return false;
  }

  if (files.length > 1) {
    alertService.displayAlert(
      'error',
      'Solo se permite subir una imagen.',
      'center',
      'top',
      ['error-snackbar']
    );
    return false;
  }

  const file = files[0];

  if (!file.type.startsWith('image/')) {
    alertService.displayAlert(
      'error',
      'Solo se permiten archivos de imagen (JPG, PNG, WEBP).',
      'center',
      'top',
      ['error-snackbar']
    );
    return false;
  }

  if (file.size > 10 * 1024 * 1024) {
    alertService.displayAlert(
      'error',
      `La imagen ${file.name} supera el tamaño máximo permitido (10MB).`,
      'center',
      'top',
      ['error-snackbar']
    );
    return false;
  }

  return true;
}

