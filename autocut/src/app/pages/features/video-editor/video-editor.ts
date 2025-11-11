import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import CreativeEditorSDK, { Configuration } from '@cesdk/cesdk-js';
import { VideoEditorMediaService } from '../../../core/services/video-editor/video-editor-media.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-video-editor',
  imports: [],
  templateUrl: './video-editor.html',
  styleUrls: ['./video-editor.scss']
})
export class VideoEditorComponent {
  @ViewChild('cesdk_container') containerRef: ElementRef = {} as ElementRef;
  private cesdk: any = null;
  private mediaService = inject(VideoEditorMediaService);

  async ngAfterViewInit(): Promise<void> {
    try {
      const config: Configuration = {
        license: environment.CESDK_LICENSE,
        userId: 'guides-user',
        theme: 'light',
        ui: {
          elements: {
            navigation: {
              position: 'top' as any
            }
          }
        }
      };

      this.cesdk = await CreativeEditorSDK.create(this.containerRef.nativeElement, config);

      this.cesdk.feature.enable('ly.img.settings', () => true);

      this.cesdk.ui.setView('default');

      this.cesdk.ui.insertNavigationBarOrderComponent('last', {
        id: 'ly.img.actions.navigationBar',
        children: [
          'ly.img.saveScene.navigationBar',
          'ly.img.importScene.navigationBar',
          'ly.img.exportScene.navigationBar',
          'ly.img.exportVideo.navigationBar'
        ]
      });

      this.cesdk.addDefaultAssetSources();
      this.cesdk.addDemoAssetSources({
        sceneMode: 'Video',
        withUploadAssetSources: true
      });
      
      this.cesdk.ui.setBackgroundTrackAssetLibraryEntries([
        'ly.img.image',
        'ly.img.video'
      ]);
      
      const scene = await this.cesdk.createVideoScene();

      this.mediaService.initialize(this.cesdk);

      this.setupExportImportHandlers();
    } catch (error) {
      console.error('Error initializing Creative Editor SDK:', error);
    }
  }

  private setupExportImportHandlers(): void {
    const originalExportScene = this.cesdk.engine.scene.saveToString;
    
    this.cesdk.engine.scene.saveToString = async () => {
      await this.mediaService.replaceAllBlobUrls();
      return await originalExportScene?.call(this.cesdk.engine.scene);
    };
  }

  ngOnDestroy(): void {
    if (this.cesdk) {
      this.cesdk.dispose();
    }
    this.mediaService.dispose();
  }
} 