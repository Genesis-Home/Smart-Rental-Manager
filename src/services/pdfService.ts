import RNHTMLtoPDF from "react-native-html-to-pdf";
import RNFS from "react-native-fs";
import moment from "moment";

export const generateSchedulePDF = async (scheduleData: any) => {
  try {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; }
            .header { margin-bottom: 30px; }
            .invoice-title { font-size: 24px; color: #24A69E; text-align: center; margin-bottom: 10px; }
            .invoice-details { font-size: 14px; margin-bottom: 20px; display: flex; justify-content: space-between; }
            .invoice-details span { font-weight: bold; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            .customer-info div { margin-bottom: 8px; }
            .customer-info .label { font-weight: bold; color: #333; display: inline-block; width: 100px; }
            .customer-info .value { color: #666; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
            th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
            th { background-color: #f2f2f2; }
            .table-label { font-weight: bold; color: #333; }
            .table-value { color: #666; text-align: left; }
            .total-row td { font-weight: bold; }
            .notes-content { 
              padding: 10px; 
              background-color: #f9f9f9; 
              border: 1px solid #eee; 
              border-radius: 5px; 
              margin-top: 10px;
              white-space: pre-wrap;
              line-height: 1.5;
            }
            .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="invoice-title">Invoice</div>
            <div class="invoice-details">
              <div><span>Invoice ID:</span> ${scheduleData.id || 'N/A'}</div>
              <div><span>Invoice Date:</span> ${moment().format('MMMM D, YYYY')}</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Customer Information</div>
            <div class="customer-info">
              <div><span class="label">Name:</span> <span class="value"> ${scheduleData.clientName}</span></div>
              <div><span class="label">Email:</span> <span class="value"> ${scheduleData.email}</span></div>
              <div><span class="label">Phone:</span> <span class="value"> ${scheduleData.phoneNum}</span></div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Visit Details</div>
            <table>
              <tr>
                <td class="table-label">Property:</td>
                <td class="table-value"> ${scheduleData.property}</td>
              </tr>
              <tr>
                <td class="table-label">Location:</td>
                <td class="table-value"> ${
                scheduleData.location?.address
              }</td>
              </tr>
              <tr>
                <td class="table-label">Visit Dates:</td>
                <td class="table-value"> ${scheduleData.visitDates}</td>
              </tr>
              <tr>
                <td class="table-label">Visit Time:</td>
                <td class="table-value"> ${scheduleData.visitTime}</td>
              </tr>
              ${
              scheduleData.numberOfVisitors
                ? `
              <tr>
                <td class="table-label">Number of Visitors:</td>
                <td class="table-value"> ${scheduleData.numberOfVisitors}</td>
              </tr>
              `
                : ""
            }
              ${
              scheduleData.numberOfInfants
                ? `
              <tr>
                <td class="table-label">Number of Infants:</td>
                <td class="table-value"> ${scheduleData.numberOfInfants}</td>
              </tr>
              `
                : ""
            }
            </table>
          </div>

          <div class="section">
            <div class="section-title">Financial Details</div>
            <table>
               <tr>
                <td class="table-label">Agreed Price:</td>
                <td class="table-value"> ${scheduleData.agreedPrice}</td>
              </tr>
              <tr>
                <td class="table-label">Down Payment:</td>
                <td class="table-value"> ${scheduleData.advanceAmount || "0"}</td>
              </tr>
              <tr>
                <td class="table-label">Balance Amount:</td>
                <td class="table-value"> ${(
                parseFloat(scheduleData.agreedPrice || "0") -
                parseFloat(scheduleData.advanceAmount || "0")
              )}</td>
              </tr>
            </table>
          </div>

          ${
            scheduleData.notes
              ? `
          <div class="section">
            <div class="section-title">Notes</div>
            <div class="notes-content">${scheduleData.notes} </div>
          </div>
          `
              : ""
          }

          <div class="footer">
            <p>Generated on ${moment().format("MMMM D, YYYY h:mm A")}</p>
            <p>Thank you for choosing our service!</p>
          </div>
        </body>
      </html>
    `;

    const timestamp = moment().format("YYYY-MM-DD_HH-mm-ss");
    const fileName = `Booking_Invoice_${timestamp}`;

    const options = {
      html: htmlContent,
      fileName: fileName,
      directory: "Cache",
      base64: false,
      height: 792,
      width: 612,
      padding: 10,
    };

    console.log("Generating PDF with options:", options);
    const file = await RNHTMLtoPDF.convert(options);
    console.log("PDF generated at:", file.filePath);

    if (!file.filePath) {
      throw new Error("PDF generation failed - no file path returned");
    }

    const fileExists = await RNFS.exists(file.filePath);
    if (!fileExists) {
      throw new Error("PDF file not found after generation");
    }

    const fileInfo = await RNFS.stat(file.filePath);
    if (fileInfo.size === 0) {
      throw new Error("Generated PDF file is empty");
    }

    const downloadsPath = `${RNFS.DownloadDirectoryPath}/${fileName}.pdf`;
    const downloadsDirExists = await RNFS.exists(RNFS.DownloadDirectoryPath);
    if (!downloadsDirExists) {
      await RNFS.mkdir(RNFS.DownloadDirectoryPath);
    }

    await RNFS.copyFile(file.filePath, downloadsPath);
    console.log("PDF copied to:", downloadsPath);

    const copiedFileExists = await RNFS.exists(downloadsPath);
    if (!copiedFileExists) {
      throw new Error("Failed to copy PDF to downloads directory");
    }

    try {
      await RNFS.unlink(file.filePath);
    } catch (cleanupError) {
      console.warn("Failed to clean up temporary PDF file:", cleanupError);
    }

    return downloadsPath;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
