import { Injectable, inject } from '@angular/core';
// @ts-ignore: No type declarations for 'bytez.js' are available
import Bytez from 'bytez.js';
import { environment } from '../../../../environments/environment';
import { UploaderService } from '../cloudinary/uploader.service';
import { LoggerService } from '../utils/logger.service';

@Injectable({
  providedIn: 'root',
})
export class HotWheelsImageService {
  private uploaderService = inject(UploaderService);
  private bytezSdk = new Bytez(environment.bytezApiKey);
  private readonly modelId = 'stabilityai/stable-diffusion-xl-base-1.0';
  private readonly uploadFolder = 'ai-identification-hotwheels';
  private logger: LoggerService = inject(LoggerService);
  async generateImage(prompt: string): Promise<string> {
    const model = this.bytezSdk.model(this.modelId);
    const { error, output } = await model.run(prompt);

    if (error) {
      this.logger.error('Bytez API error:', error);
      throw new Error(`Bytez API error: ${error}`);
    }

    const normalizedOutput = await this.normalizeOutput(output);

    const imageBlob = await this.convertOutputToBlob(normalizedOutput);

    return this.uploaderService.uploadBlob(
      imageBlob,
      this.uploadFolder,
      `hotwheels-${Date.now()}.png`
    );
  }

  private async normalizeOutput(
    output: unknown
  ): Promise<string> {
    if (Array.isArray(output) && output.length > 0) {
      return output[0];
    }

    if (typeof output === 'string') {
      return output;
    }

    throw new Error('Unexpected output type from Bytez API');
  }

  private async convertOutputToBlob(output: string): Promise<Blob> {
    if (output.startsWith('data:image')) {
      const base64Data = output.split(',')[1];
      if (!base64Data) {
        throw new Error('Invalid base64 image data received from Bytez API');
      }
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: 'image/png' });
    }

    if (output.startsWith('http')) {
      const response = await fetch(output);
      if (!response.ok) {
        throw new Error('Failed to fetch generated image from Bytez API');
      }
      return await response.blob();
    }

    throw new Error('Unsupported output format from Bytez API');
  }
}

