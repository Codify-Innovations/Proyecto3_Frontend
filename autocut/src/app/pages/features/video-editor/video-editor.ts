import { Component, ElementRef, ViewChild } from '@angular/core';
import CreativeEditorSDK, { Configuration } from '@cesdk/cesdk-js';

@Component({
  selector: 'app-video-editor',
  imports: [],
  templateUrl: './video-editor.html',
  styleUrls: ['./video-editor.scss']
})
export class VideoEditorComponent {
  @ViewChild('cesdk_container') containerRef: ElementRef = {} as ElementRef;
  private cesdk: any = null;

  async ngAfterViewInit(): Promise<void> {
    try {
      const config: Configuration = {
        license: 'FR8R2GdlO_sZYWkEhu9okfd37eFiqV4Bzk1RK6RAR8-THLgCgpWhsq5muHi_s2zC',
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

      // Enable settings panel
      this.cesdk.feature.enable('ly.img.settings', () => true);

      // Set the editor view mode
      this.cesdk.ui.setView('default');

      // Configure navigation bar actions using the new API
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
    } catch (error) {
      console.error('Error initializing Creative Editor SDK:', error);
    }
  }

  ngOnDestroy(): void {
    if (this.cesdk) {
      this.cesdk.dispose();
    }
  }
} 