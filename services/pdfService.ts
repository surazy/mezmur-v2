import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import { Mezmur } from '@/types';
import { Asset } from 'expo-asset';

export interface PDFExportOptions {
  fontSize?: number;
  includeAudio?: boolean;
  includeMetadata?: boolean;
  darkMode?: boolean;
}

export class PDFService {
  // 🖼️ Load the watermark image from assets as base64
  private static async getBase64Watermark(): Promise<string> {
    try {
      const asset = Asset.fromModule(
        require('@/assets/images/iconer.png')
      );
      await asset.downloadAsync();

      const base64 = await FileSystem.readAsStringAsync(asset.localUri!, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return `data:image/png;base64,${base64}`;
    } catch (err) {
      console.warn('⚠️ Failed to load watermark:', err);
      return '';
    }
  }

  private static generateCSS(options: PDFExportOptions = {}, watermarkUri = '') {
    const { fontSize = 16, darkMode = false } = options;
    return `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Noto Sans Ethiopic', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: ${fontSize}px;
          line-height: 1.6;
          color: ${darkMode ? '#FFFFFF' : '#1A1A1A'};
          background-color: ${darkMode ? '#000000' : '#FFFFFF'};
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        
          /* 🌊 Logo watermark */
        ${watermarkUri
        ? `
        body::before {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('${watermarkUri}');
          background-repeat: no-repeat;
          background-position: center center;
          background-size: 320px;
          opacity: 0.08;
          z-index: -1;
          transform: rotate(-20deg);
        }`
        : ''}


        .header {
  background-color: ${darkMode ? '#111111' : '#FFF8E1'};
  border-bottom: 1px solid #FFD700;
  border-radius: 8px;
  padding: 12px 0;
  margin-bottom: 20px;
  text-align: center;
}

        
        .app-title {
          font-size: 22px;
          font-weight: bold;
          color: #FFD700;
          margin-bottom: 4px;
        }
        
        .export-date {
          font-size: 11px;
          color: ${darkMode ? '#B8B8B8' : '#666666'};
        }
        
        .mezmur-container {
          margin-bottom: 40px;
          page-break-inside: avoid;
        }
        
        .mezmur-title {
          font-size: ${fontSize + 4}px;
          font-weight: bold;
          color: #FFD700;
          margin-bottom: 15px;
          text-align: center;
          padding: 10px 0;
          border-bottom: 1px solid ${darkMode ? '#333333' : '#E5E5E5'};
        }
        
        .mezmur-meta {
          background-color: ${darkMode ? '#1A1A1A' : '#F8F9FA'};
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          border-left: 4px solid #FFD700;
        }
        
        .meta-item {
          margin-bottom: 8px;
          display: flex;
          align-items: center;
        }
        
        .meta-label {
          font-weight: bold;
          color: #FFD700;
          margin-right: 10px;
          min-width: 80px;
        }
        
        .meta-value {
          color: ${darkMode ? '#FFFFFF' : '#1A1A1A'};
        }
        
        .mezmur-content {
          background-color: ${darkMode ? '#1A1A1A' : '#FFFFFF'};
          padding: 20px;
          border-radius: 8px;
          border: 1px solid ${darkMode ? '#333333' : '#E5E5E5'};
          white-space: pre-wrap;
          font-size: ${fontSize}px;
          line-height: 1.8;
          text-align: left;
          direction: ltr;
        }
        
        .audio-info {
          background-color: #FFD700;
          color: #000000;
          padding: 10px 15px;
          border-radius: 20px;
          font-size: ${fontSize - 2}px;
          font-weight: 500;
          display: inline-block;
          margin-top: 10px;
        }
        
        .page-break {
          page-break-before: always;
        }
        
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid ${darkMode ? '#333333' : '#E5E5E5'};
          font-size: ${fontSize - 2}px;
          color: ${darkMode ? '#B8B8B8' : '#666666'};
        }
        
        .collection-title {
          font-size: ${fontSize + 6}px;
          font-weight: bold;
          color: #FFD700;
          text-align: center;
          margin-bottom: 30px;
          padding: 20px 0;
          border: 2px solid #FFD700;
          border-radius: 8px;
          background-color: ${darkMode ? '#1A1A1A' : '#FFFBF0'};
        }
        
        @media print {
          body { margin: 0; }
          .page-break { page-break-before: always; }
        }
      </style>
    `;
  }

  private static generateSingleMezmurHTML(mezmur: Mezmur, options: PDFExportOptions = {}) {
    const css = this.generateCSS(options);
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const audioInfo = mezmur.audio_url ? `
      <div class="audio-info">
        🎵 Audio Available${mezmur.audio_duration ? ` (${Math.floor(mezmur.audio_duration / 60)}:${String(mezmur.audio_duration % 60).padStart(2, '0')})` : ''}
      </div>
    ` : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${mezmur.title}</title>
        ${css}
      </head>
      <body>
        <div class="header">
          <div class="app-title">ፈለገ መዝሙራት</div>
          <div class="export-date">Exported on ${currentDate}</div>
        </div>
        
        <div class="mezmur-container">
          <h1 class="mezmur-title">${mezmur.title}</h1>
          
          ${options.includeMetadata !== false ? `
          <div class="mezmur-meta">
            
            
           
            ${mezmur.isUserAdded ? `
            <div class="meta-item">
              <span class="meta-label">Source:</span>
              <span class="meta-value" style="color: #FFA500;">User Added</span>
            </div>
            ` : ''}
          </div>
          ` : ''}
          
          <div class="mezmur-content">${mezmur.content}</div>
          
          ${options.includeAudio !== false && mezmur.audio_url ? audioInfo : ''}
        </div>
        
        <div class="footer">
          <p>Generated by ፈለገ መዝሙራት App</p>
        </div>
      </body>
      </html>
    `;
  }

  private static generateMultipleMezmurasHTML(mezmurs: Mezmur[], title: string, options: PDFExportOptions = {}) {
    const css = this.generateCSS(options);
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const mezmurasHTML = mezmurs.map((mezmur, index) => {
      const audioInfo = mezmur.audio_url && options.includeAudio !== false ? `
        <div class="audio-info">
          🎵 Audio Available${mezmur.audio_duration ? ` (${Math.floor(mezmur.audio_duration / 60)}:${String(mezmur.audio_duration % 60).padStart(2, '0')})` : ''}
        </div>
      ` : '';

      return `
        <div class="mezmur-container${index > 0 ? ' page-break' : ''}">
          <h2 class="mezmur-title">${mezmur.title}</h2>
          
         
          
          <div class="mezmur-content">${mezmur.content}</div>
          ${audioInfo}
        </div>
      `;
    }).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        ${css}
      </head>
      <body>
        <div class="header">
          <div class="app-title">ፈለገ መዝሙራት</div>
          <div class="export-date">Exported on ${currentDate}</div>
        </div>
        
        <div class="collection-title">${title}</div>
        
        ${mezmurasHTML}
        
        <div class="footer">
          <p>Generated by ፈለገ መዝሙራት</p>
          <p>Total Mezmurs: ${mezmurs.length}</p>
        </div>
      </body>
      </html>
    `;
  }

  static async exportSingleMezmur(
    mezmur: Mezmur,
    options: PDFExportOptions = {}
  ): Promise<{ success: boolean; uri?: string; error?: string }> {
    try {
      const html = this.generateSingleMezmurHTML(mezmur, options);

      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
        margins: {
          left: 20,
          top: 20,
          right: 20,
          bottom: 20,
        },
      });

      return { success: true, uri };
    } catch (error) {
      console.error('Error exporting single mezmur:', error);
      return {
        success: false,
        error: 'Failed to generate PDF. Please try again.'
      };
    }
  }

  static async exportMultipleMezmurs(
    mezmurs: Mezmur[],
    title: string,
    options: PDFExportOptions = {}
  ): Promise<{ success: boolean; uri?: string; error?: string }> {
    try {
      if (mezmurs.length === 0) {
        return { success: false, error: 'No mezmurs selected for export.' };
      }

      const html = this.generateMultipleMezmurasHTML(mezmurs, title, options);

      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
        margins: {
          left: 20,
          top: 20,
          right: 20,
          bottom: 20,
        },
      });

      return { success: true, uri };
    } catch (error) {
      console.error('Error exporting multiple mezmurs:', error);
      return {
        success: false,
        error: 'Failed to generate PDF. Please try again.'
      };
    }
  }

  static async sharePDF(uri: string): Promise<{ success: boolean; error?: string }> {
    try {
      const isAvailable = await Sharing.isAvailableAsync();

      if (!isAvailable) {
        return {
          success: false,
          error: 'Sharing is not available on this device.'
        };
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Mezmur PDF',
      });

      return { success: true };
    } catch (error) {
      console.error('Error sharing PDF:', error);
      return {
        success: false,
        error: 'Failed to share PDF. Please try again.'
      };
    }
  }

  static async exportAndShare(
    mezmurs: Mezmur | Mezmur[],
    title?: string,
    options: PDFExportOptions = {}
  ): Promise<{ success: boolean; error?: string }> {
    try {
      let result;

      if (Array.isArray(mezmurs)) {
        result = await this.exportMultipleMezmurs(mezmurs, title || 'Mezmur Collection', options);
      } else {
        result = await this.exportSingleMezmur(mezmurs, options);
      }

      if (!result.success) {
        return result;
      }

      // Share the generated PDF
      const shareResult = await this.sharePDF(result.uri!);

      // Clean up the temporary file after sharing
      try {
        await FileSystem.deleteAsync(result.uri!, { idempotent: true });
      } catch (cleanupError) {
        console.warn('Failed to clean up temporary PDF file:', cleanupError);
      }

      return shareResult;
    } catch (error) {
      console.error('Error in exportAndShare:', error);
      return {
        success: false,
        error: 'Failed to export and share PDF. Please try again.'
      };
    }
  }

  static generateFileName(mezmur: Mezmur | Mezmur[], prefix: string = 'mezmur'): string {
    const timestamp = new Date().toISOString().split('T')[0];

    if (Array.isArray(mezmur)) {
      return `${prefix}_collection_${timestamp}.pdf`;
    } else {
      const cleanTitle = mezmur.title.replace(/[^a-zA-Z0-9አ-ፚ]/g, '_').substring(0, 30);
      return `${prefix}_${cleanTitle}_${timestamp}.pdf`;
    }
  }
}