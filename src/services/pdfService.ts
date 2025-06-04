import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import moment from 'moment';

export const generateSchedulePDF = async (scheduleData: any) => {
  try {
    // Create HTML content for the PDF
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .title { font-size: 24px; color: #2E7D32; margin-bottom: 10px; }
            .subtitle { font-size: 18px; color: #666; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; color: #333; }
            .value { color: #666; }
            .row { margin-bottom: 10px; }
            .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Booking Invoice</div>
            <div class="subtitle">Property Visit Schedule</div>
          </div>
          
          <div class="section">
            <div class="row">
              <span class="label">Client Name:</span>
              <span class="value"> ${scheduleData.clientName}</span>
            </div>
            <div class="row">
              <span class="label">Email:</span>
              <span class="value"> ${scheduleData.email}</span>
            </div>
            <div class="row">
              <span class="label">Phone:</span>
              <span class="value"> ${scheduleData.phoneNum}</span>
            </div>
          </div>

          <div class="section">
            <div class="row">
              <span class="label">Property:</span>
              <span class="value"> ${scheduleData.property}</span>
            </div>
            <div class="row">
              <span class="label">Location:</span>
              <span class="value"> ${scheduleData.location}</span>
            </div>
            <div class="row">
              <span class="label">Visit Dates:</span>
              <span class="value"> ${scheduleData.visitDates}</span>
            </div>
            <div class="row">
              <span class="label">Visit Time:</span>
              <span class="value"> ${scheduleData.visitTime}</span>
            </div>
          </div>

          <div class="section">
            <div class="row">
              <span class="label">Agreed Price:</span>
              <span class="value"> ${scheduleData.agreedPrice}</span>
            </div>
            <div class="row">
              <span class="label">Advance Amount:</span>
              <span class="value"> ${scheduleData.advanceAmount || '0'}</span>
            </div>
            <div class="row">
              <span class="label">Balance Amount:</span>
              <span class="value"> ${(parseFloat(scheduleData.agreedPrice) - (parseFloat(scheduleData.advanceAmount) || 0)).toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Generated on ${moment().format('MMMM D, YYYY h:mm A')}</p>
            <p>Thank you for choosing our service!</p>
          </div>
        </body>
      </html>
    `;

    // Generate PDF
    const options = {
      html: htmlContent,
      fileName: `Booking_Invoice_${moment().format('YYYY-MM-DD_HH-mm')}`,
      directory: 'Downloads',
      base64: false
    };

    const file = await RNHTMLtoPDF.convert(options);
    
    // Move file to Downloads folder
    const downloadsPath = `${RNFS.DownloadDirectoryPath}/${options.fileName}.pdf`;
    await RNFS.moveFile(file.filePath, downloadsPath);

    return downloadsPath;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}; 