import { Injectable, inject, signal, effect } from '@angular/core';
import { UploaderService } from '../cloudinary/uploader.service';
import { AlertService } from '../alert.service';
import { IMediaTypeConfig, MediaType } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class VideoEditorMediaService {
  private uploaderService = inject(UploaderService);
  private alertService = inject(AlertService);
  private cesdk: any = null;
  
  // Estado
  private uploadedFiles = new Map<string, string>(); // blob URL -> Cloudinary URL
  private pendingUploads = new Map<string, File>(); // blob URL -> File
  
  // Signals públicos para observar estado
  public uploadedFiles$ = signal<Map<string, string>>(new Map());
  public pendingUploads$ = signal<Map<string, File>>(new Map());
  
  // Configuración de tipos de media
  private readonly mediaConfigs: IMediaTypeConfig[] = [
    {
      fillType: '//ly.img.ubq/fill/video',
      propertyPath: 'fill/video/fileURI',
      mediaType: 'video',
      defaultExtension: 'mp4'
    },
    {
      fillType: '//ly.img.ubq/fill/image',
      propertyPath: 'fill/image/imageFileURI',
      mediaType: 'image',
      defaultExtension: 'png'
    },
    {
      fillType: '//ly.img.ubq/fill/audio',
      propertyPath: 'fill/audio/fileURI',
      mediaType: 'audio',
      defaultExtension: 'mp3'
    }
  ];

  constructor() {
    // Watch for uploaded files from Cloudinary
    effect(() => {
      if (this.uploaderService.uploaded$()) {
        const urls = this.uploaderService.urlSignal$();
        if (urls && urls.length > 0) {
          // Update the scene with Cloudinary URLs
          this.updateSceneWithCloudinaryUrls(urls);
        }
      }
    });
  }

  /**
   * Inicializa el servicio con la instancia del CreativeEngine SDK
   */
  public initialize(cesdk: any): void {
    this.cesdk = cesdk;
    this.setupUploadListener();
  }

  /**
   * Reemplaza todos los blob URLs con Cloudinary URLs antes de exportar
   */
  public async replaceAllBlobUrls(): Promise<void> {
    try {
      this.processBlocks((blockId, blockType) => {
        if (blockType === '//ly.img.ubq/audio' || 
            blockType === '//ly.img.ubq/graphic' || 
            blockType === '//ly.img.ubq/page') {
          this.replaceBlobUrlInBlock(blockId);
        }
      });
    } catch (error) {
      console.error('Error replacing blob URLs:', error);
    }
  }

  /**
   * Limpia el estado del servicio
   */
  public dispose(): void {
    this.uploadedFiles.clear();
    this.pendingUploads.clear();
    this.uploadedFiles$.set(new Map());
    this.pendingUploads$.set(new Map());
    this.cesdk = null;
  }

  // ========== Métodos Privados ==========

  private setupUploadListener(): void {
    if (!this.cesdk) return;

    // Listen for when blocks are created (including from file uploads)
    this.cesdk.engine.event.subscribe([], (events: any[]) => {
      events.forEach(async (event: any) => {
        if (event.type === 'Created') {
          const blockId = event.block;
          const blockType = this.cesdk.engine.block.getType(blockId);
          
          // Check for direct fill types (video, image, audio fills)
          const config = this.mediaConfigs.find(c => c.fillType === blockType);
          if (config) {
            const fileURI = this.cesdk.engine.block.getString(blockId, config.propertyPath);
            if (fileURI && fileURI.startsWith('blob:')) {
              await this.uploadMediaToCloudinary(blockId, fileURI, config.mediaType);
            }
            return;
          }
          
          // Check if an audio block was created (for timeline audio)
          if (blockType === '//ly.img.ubq/audio') {
            await this.handleAudioBlockCreation(blockId);
          }
        }
      });
    });
  }

  private async handleAudioBlockCreation(blockId: number): Promise<void> {
    if (!this.cesdk) return;

    const hasFill = this.cesdk.engine.block.hasFill(blockId);
    if (!hasFill) return;

    const fillId = this.cesdk.engine.block.getFill(blockId);
    const fillType = this.cesdk.engine.block.getType(fillId);
    
    const audioConfig = this.mediaConfigs.find(c => c.fillType === fillType && c.mediaType === 'audio');
    if (audioConfig) {
      const fileURI = this.cesdk.engine.block.getString(fillId, audioConfig.propertyPath);
      if (fileURI && fileURI.startsWith('blob:')) {
        await this.uploadMediaToCloudinary(fillId, fileURI, 'audio');
      }
    }
  }

  private async uploadMediaToCloudinary(fillBlockId: number, blobUrl: string, mediaType: MediaType): Promise<void> {
    try {
      // Check if already uploaded or pending
      if (this.uploadedFiles.has(blobUrl) || this.pendingUploads.has(blobUrl)) {
        return;
      }

      // Fetch the blob data
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      
      // Get media config for default extension
      const config = this.mediaConfigs.find(c => c.mediaType === mediaType);
      const defaultExtension = config?.defaultExtension || 'mp4';
      const extension = blob.type.split('/')[1] || defaultExtension;
      
      // Convert blob to File
      const fileName = `${mediaType}_${Date.now()}.${extension}`;
      const file = new File([blob], fileName, { type: blob.type });
      
      // Store as pending with fill block ID
      this.pendingUploads.set(blobUrl, file);
      this.pendingUploads$.set(new Map(this.pendingUploads));
      
      // Upload to Cloudinary in the VideoEditor folder
      this.uploaderService.uploadFiles([file], 'VideoEditor');
      
      console.log(`Uploading ${mediaType} to Cloudinary: ${fileName} from blob: ${blobUrl}`);
    } catch (error) {
      console.error(`Error uploading ${mediaType} to Cloudinary:`, error);
      const errorMessages: Record<MediaType, string> = {
        video: 'el video',
        image: 'la imagen',
        audio: 'el audio'
      };
      this.alertService.displayAlert(
        'error',
        `Error al subir ${errorMessages[mediaType]} a Cloudinary`,
        'center',
        'top',
        ['error-snackbar']
      );
    }
  }

  private updateSceneWithCloudinaryUrls(cloudinaryUrls: string[]): void {
    try {
      if (!this.cesdk) return;

      this.processBlocks((blockId, blockType) => {
        if (blockType === '//ly.img.ubq/audio') {
          this.processBlockFill(blockId, cloudinaryUrls, true);
        } else if (blockType === '//ly.img.ubq/graphic' || blockType === '//ly.img.ubq/page') {
          this.processBlockFill(blockId, cloudinaryUrls, false);
        }
      });
    } catch (error) {
      console.error('Error updating scene with Cloudinary URLs:', error);
    }
  }

  private processBlocks(callback: (blockId: number, blockType: string) => void): void {
    if (!this.cesdk) return;

    const allBlocks = this.cesdk.engine.block.findAll();
    for (const blockId of allBlocks) {
      const blockType = this.cesdk.engine.block.getType(blockId);
      callback(blockId, blockType);
    }
  }

  private processBlockFill(blockId: number, cloudinaryUrls: string[], requirePending: boolean): void {
    if (!this.cesdk) return;

    const hasFill = this.cesdk.engine.block.hasFill(blockId);
    if (!hasFill) return;

    const fillId = this.cesdk.engine.block.getFill(blockId);
    const fillType = this.cesdk.engine.block.getType(fillId);
    
    const config = this.mediaConfigs.find(c => c.fillType === fillType);
    if (!config) return;

    const currentUri = this.cesdk.engine.block.getString(fillId, config.propertyPath);
    
    if (currentUri && currentUri.startsWith('blob:')) {
      const shouldUpdate = !requirePending || this.pendingUploads.has(currentUri);
      
      if (shouldUpdate && cloudinaryUrls.length > 0) {
        const cloudinaryUrl = cloudinaryUrls[0];
        this.cesdk.engine.block.setString(fillId, config.propertyPath, cloudinaryUrl);
        this.uploadedFiles.set(currentUri, cloudinaryUrl);
        this.uploadedFiles$.set(new Map(this.uploadedFiles));
        this.pendingUploads.delete(currentUri);
        this.pendingUploads$.set(new Map(this.pendingUploads));
        cloudinaryUrls.shift();
        console.log(`Updated ${config.mediaType} block ${blockId} with Cloudinary URL: ${cloudinaryUrl}`);
      }
    }
  }

  private replaceBlobUrlInBlock(blockId: number): void {
    if (!this.cesdk) return;

    const hasFill = this.cesdk.engine.block.hasFill(blockId);
    if (!hasFill) return;

    const fillId = this.cesdk.engine.block.getFill(blockId);
    const fillType = this.cesdk.engine.block.getType(fillId);
    
    const config = this.mediaConfigs.find(c => c.fillType === fillType);
    if (!config) return;

    const currentUri = this.cesdk.engine.block.getString(fillId, config.propertyPath);
    
    if (currentUri && currentUri.startsWith('blob:')) {
      const cloudinaryUrl = this.uploadedFiles.get(currentUri);
      
      if (cloudinaryUrl) {
        this.cesdk.engine.block.setString(fillId, config.propertyPath, cloudinaryUrl);
      } else {
        console.warn(`No Cloudinary URL found for ${config.mediaType} blob: ${currentUri}`);
      }
    }
  }
}

