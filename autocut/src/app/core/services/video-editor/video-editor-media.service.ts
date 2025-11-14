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
  private currentUploadBlobUrl: string | null = null; // Track the blob URL currently being uploaded
  
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
      // First, try to replace known blob URLs with their Cloudinary URLs
      this.processBlocks((blockId, blockType) => {
        if (blockType === '//ly.img.ubq/audio' || 
            blockType === '//ly.img.ubq/graphic' || 
            blockType === '//ly.img.ubq/page') {
          this.replaceBlobUrlInBlock(blockId);
        }
      });

      // Then, handle any remaining blob URLs that weren't in the map
      // These might be from imported scenes where Cloudinary URLs were converted to blob URLs
      await this.handleUnmappedBlobUrls();
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
    this.currentUploadBlobUrl = null;
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
      
      // If we're tracking a current upload, only process that one
      // Otherwise, process any pending upload (for normal flow)
      const isCurrentUpload = this.currentUploadBlobUrl === currentUri;
      const shouldProcess = shouldUpdate && cloudinaryUrls.length > 0 && 
        (this.currentUploadBlobUrl ? isCurrentUpload : true);
      
      if (shouldProcess) {
        const cloudinaryUrl = cloudinaryUrls[0];
        this.cesdk.engine.block.setString(fillId, config.propertyPath, cloudinaryUrl);
        this.uploadedFiles.set(currentUri, cloudinaryUrl);
        this.uploadedFiles$.set(new Map(this.uploadedFiles));
        this.pendingUploads.delete(currentUri);
        this.pendingUploads$.set(new Map(this.pendingUploads));
        cloudinaryUrls.shift();
        
        // Clear current upload tracking if this was the one we were waiting for
        if (isCurrentUpload) {
          this.currentUploadBlobUrl = null;
        }
        
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
        console.log(`Replaced blob URL with Cloudinary URL for ${config.mediaType} block ${blockId}`);
      } else {
        console.warn(`No Cloudinary URL found for ${config.mediaType} blob: ${currentUri}`);
      }
    }
  }

  /**
   * Handles blob URLs that don't have Cloudinary URL mappings
   * This can happen when scenes are imported and Cloudinary URLs are converted to blob URLs
   */
  private async handleUnmappedBlobUrls(): Promise<void> {
    if (!this.cesdk) return;

    const unmappedBlobs: Array<{ fillId: number; blobUrl: string; mediaType: MediaType }> = [];

    // Find all blob URLs that don't have Cloudinary URL mappings
    this.processBlocks((blockId, blockType) => {
      if (blockType === '//ly.img.ubq/audio' || 
          blockType === '//ly.img.ubq/graphic' || 
          blockType === '//ly.img.ubq/page') {
        const hasFill = this.cesdk.engine.block.hasFill(blockId);
        if (!hasFill) return;

        const fillId = this.cesdk.engine.block.getFill(blockId);
        const fillType = this.cesdk.engine.block.getType(fillId);
        
        const config = this.mediaConfigs.find(c => c.fillType === fillType);
        if (!config) return;

        const currentUri = this.cesdk.engine.block.getString(fillId, config.propertyPath);
        
        if (currentUri && currentUri.startsWith('blob:') && !this.uploadedFiles.has(currentUri)) {
          unmappedBlobs.push({ fillId, blobUrl: currentUri, mediaType: config.mediaType });
        }
      }
    });

    if (unmappedBlobs.length === 0) {
      return;
    }

    console.log(`Found ${unmappedBlobs.length} unmapped blob URL(s) that need to be uploaded to Cloudinary`);

    // Upload unmapped blob URLs to Cloudinary one at a time to ensure correct mapping
    for (const { fillId, blobUrl, mediaType } of unmappedBlobs) {
      try {
        console.log(`Uploading unmapped ${mediaType} blob URL to Cloudinary: ${blobUrl}`);
        await this.uploadAndReplaceBlobUrl(fillId, blobUrl, mediaType);
      } catch (error) {
        console.error(`Error uploading unmapped ${mediaType} blob URL:`, error);
        // Continue with other uploads even if one fails
      }
    }
  }

  /**
   * Uploads a blob URL to Cloudinary and replaces it in the scene
   */
  private async uploadAndReplaceBlobUrl(fillId: number, blobUrl: string, mediaType: MediaType): Promise<void> {
    try {
      // Check if already uploaded
      if (this.uploadedFiles.has(blobUrl)) {
        const cloudinaryUrl = this.uploadedFiles.get(blobUrl);
        if (cloudinaryUrl) {
          const config = this.mediaConfigs.find(c => c.mediaType === mediaType);
          if (config) {
            this.cesdk.engine.block.setString(fillId, config.propertyPath, cloudinaryUrl);
            console.log(`Replaced unmapped blob URL with Cloudinary URL: ${cloudinaryUrl}`);
          }
        }
        return;
      }

      // Check if already pending - wait for it to complete
      if (this.pendingUploads.has(blobUrl)) {
        await this.waitForUpload(blobUrl);
        const cloudinaryUrl = this.uploadedFiles.get(blobUrl);
        if (cloudinaryUrl) {
          const config = this.mediaConfigs.find(c => c.mediaType === mediaType);
          if (config) {
            this.cesdk.engine.block.setString(fillId, config.propertyPath, cloudinaryUrl);
            console.log(`Replaced unmapped blob URL with Cloudinary URL: ${cloudinaryUrl}`);
          }
        }
        return;
      }

      // Try to fetch the blob - if it fails, the blob URL is stale/invalid
      let blob: Blob;
      try {
        const response = await fetch(blobUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch blob: ${response.statusText}`);
        }
        blob = await response.blob();
      } catch (error) {
        console.error(`Cannot fetch blob URL (may be stale): ${blobUrl}`, error);
        // If we can't fetch the blob, we can't upload it
        // This might happen if the blob URL is from a previous session
        throw new Error(`Blob URL is no longer valid: ${blobUrl}. Please re-upload the media file.`);
      }
      
      // Get media config for default extension
      const config = this.mediaConfigs.find(c => c.mediaType === mediaType);
      const defaultExtension = config?.defaultExtension || 'mp4';
      const extension = blob.type.split('/')[1] || defaultExtension;
      
      // Convert blob to File
      const fileName = `${mediaType}_${Date.now()}.${extension}`;
      const file = new File([blob], fileName, { type: blob.type });
      
      // Store as pending - this will be tracked by the upload service
      this.pendingUploads.set(blobUrl, file);
      this.pendingUploads$.set(new Map(this.pendingUploads));
      
      // Track this as the current upload so updateSceneWithCloudinaryUrls can match it correctly
      this.currentUploadBlobUrl = blobUrl;
      
      // Upload to Cloudinary - this will trigger the effect that calls updateSceneWithCloudinaryUrls
      this.uploaderService.uploadFiles([file], 'VideoEditor');
      
      // Wait for upload to complete and be processed
      await this.waitForUpload(blobUrl);
      
      // Clear current upload tracking
      this.currentUploadBlobUrl = null;
      
      // Replace blob URL with Cloudinary URL
      const cloudinaryUrl = this.uploadedFiles.get(blobUrl);
      if (cloudinaryUrl && config) {
        this.cesdk.engine.block.setString(fillId, config.propertyPath, cloudinaryUrl);
        console.log(`Replaced unmapped blob URL with Cloudinary URL: ${cloudinaryUrl}`);
      } else {
        console.warn(`Cloudinary URL not available for blob: ${blobUrl}`);
      }
    } catch (error) {
      console.error(`Error uploading and replacing blob URL:`, error);
      throw error;
    }
  }

  /**
   * Waits for a blob URL to be uploaded to Cloudinary and added to uploadedFiles map
   * The upload service's effect will call updateSceneWithCloudinaryUrls which populates uploadedFiles
   */
  private async waitForUpload(blobUrl: string, maxWaitTime: number = 15000): Promise<void> {
    const startTime = Date.now();
    const checkInterval = 100; // Check every 100ms

    while (!this.uploadedFiles.has(blobUrl)) {
      if (Date.now() - startTime > maxWaitTime) {
        throw new Error(`Timeout waiting for upload of blob: ${blobUrl}`);
      }
      await new Promise(resolve => setTimeout(resolve, checkInterval));
    }
  }
}

