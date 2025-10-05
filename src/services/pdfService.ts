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
            .gallery-section { margin-top: 30px; }
            .gallery-title { font-size: 16px; font-weight: bold; color: #24A69E; margin-bottom:10px}
            .gallery-grid { display: flex; flex-wrap: wrap; gap: 8px; }
            .gallery-img-box { width: 20%; margin-bottom: 8px; }
            .gallery-img { width: 100%; aspect-ratio: 1/1; object-fit: cover; border-radius: 8px; background: #eee; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="invoice-title">Invoice</div>
            <div class="invoice-details">
              <div><span>Invoice ID:</span> ${scheduleData.id || "N/A"}</div>
              <div><span>Invoice Date:</span> ${moment().format(
      "MMMM D, YYYY"
    )}</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Customer Information</div>
            <div class="customer-info">
              <div><span class="label">Name:</span> <span class="value"> ${scheduleData.clientName
      }</span></div>
              <div><span class="label">Email:</span> <span class="value"> ${scheduleData.email
      }</span></div>
              <div><span class="label">Phone:</span> <span class="value"> ${scheduleData.phoneNum
      }</span></div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Visit Details</div>
            <table>
              <tr>
                <td class="table-label">Property Name:</td>
                <td class="table-value"> ${scheduleData.property}</td>
              </tr>
              <tr>
                <td class="table-label">Location:</td>
                <td class="table-value"> ${scheduleData.location?.address}</td>
              </tr>
              <tr>
                <td class="table-label">Visit Dates:</td>
                <td class="table-value"> ${scheduleData.visitDates}</td>
              </tr>
              <tr>
                <td class="table-label">Check In Time:</td>
                <td class="table-value"> ${scheduleData.checkInTime}</td>
              </tr>
              <tr>
                <td class="table-label">Check Out Time:</td>
                <td class="table-value"> ${scheduleData.checkOutTime}</td>
              </tr>
              ${scheduleData.numberOfVisitors
        ? `
              <tr>
                <td class="table-label">Number of Visitors:</td>
                <td class="table-value"> ${scheduleData.numberOfVisitors}</td>
              </tr>
              `
        : ""
      }
              ${scheduleData.numberOfInfants
        ? `
              <tr>
                <td class="table-label">Number of Infants:</td>
                <td class="table-value"> ${scheduleData.numberOfInfants}</td>
              </tr>
              `
        : ""
      }
              ${scheduleData.otherDetails
        ? `
              <tr>
                <td class="table-label">Details For Customer:</td>
                <td class="table-value"> ${scheduleData.otherDetails}</td>
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
                <td class="table-value"> ${scheduleData.advanceAmount || "0"
      }</td>
              </tr>
              <tr>
                <td class="table-label">Balance Amount:</td>
                <td class="table-value"> ${parseFloat(scheduleData.agreedPrice || "0") -
      parseFloat(scheduleData.advanceAmount || "0")
      }</td>
              </tr>
            </table>
          </div>
             ${scheduleData.images && scheduleData.images.length > 1
        ? `
            <div class="gallery-section">
              <div class="gallery-title">Property Images</div>
              <div class="gallery-grid">
              ${(scheduleData.images as string[])
          .slice(1)
          .map(
            (img: string) => `
    <div class="gallery-img-box">
      <img src="${img}" class="gallery-img" />
    </div>
  `
          )
          .join("")}

              </div>
            </div>
          `
        : ""
      }

          ${scheduleData.notes
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

export const generatePropertyPDF = async (propertyData: {
  id: string;
  title: string;
  description: string;
  location: { address: string; lat: number; long: number | null };
  images: string[];
  otherDetails?: string;
  notes?: string;
}) => {
  try {
    const mapsUrl = propertyData.location?.lat && propertyData.location?.long
      ? `https://www.google.com/maps?q=${propertyData.location.lat},${propertyData.location.long}`
      : propertyData.location?.address
        ? `https://www.google.com/maps/search/${encodeURIComponent(propertyData.location.address)}`
        : "";

    const heroImage = propertyData.images && propertyData.images.length > 0 ? propertyData.images[0] : "";

    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            @page { size: A4; margin: 18pt 18pt 22pt 18pt; }
            :root {
              --primary: #24A69E;
              --bg: #F6F8FA;
              --text: #1F2937;
              --muted: #6B7280;
              --card: #FFFFFF;
              --border: #E5E7EB;
            }
            * { box-sizing: border-box; }
            body { margin: 0; padding: 0; background: var(--bg); font-family: Arial, Helvetica, sans-serif; color: var(--text); }
            .container { width: 100%; max-width: 720px; margin: 0 auto; padding: 14px; }
            .header { background: var(--card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
            .bar { background: var(--primary); color: #fff; padding: 14px 18px; font-weight: 700; font-size: 18px; display: flex; align-items: center; justify-content: space-between; }
            .bar small { font-weight: 400; font-size: 12px; opacity: .95; }
            .hero { width: 100%; background: #ececec; }
            .hero-img { width: 100%; height: auto; max-height: 280px; display: block; object-fit: cover; }
            .content { padding: 14px; }
            .grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 12px; }
            .card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 12px; page-break-inside: avoid; }
            .section-title { color: var(--primary); font-size: 14px; font-weight: 700; margin: 0 0 8px; letter-spacing: .2px; }
            .text { font-size: 12.5px; line-height: 1.65; color: var(--text); white-space: pre-wrap; }
            .muted { color: var(--muted); font-size: 12px; }
            .info-row { display: grid; grid-template-columns: 95px 1fr; gap: 8px; margin: 4px 0; font-size: 12.5px; align-items: start; }
            .pill { display: inline-block; padding: 6px 10px; border-radius: 999px; border: 1px solid #cbecea; background: #f4fffe; color: var(--primary); font-size: 12px; }
            .btn { display: inline-block; padding: 10px 12px; background: var(--primary); color: #fff; text-decoration: none; border-radius: 8px; font-size: 13px; }
            .gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
            .image { width: 100%; height: 140px; border-radius: 10px; object-fit: cover; background: #eee; }
            .footer { text-align: center; color: var(--muted); font-size: 11.5px; margin-top: 10px; }
            @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header" style="width: 94%; margin: 0 auto;">
              <div class="bar">
                <span>${propertyData.title || "Property"}</span>
                <small>${moment().format("MMM D, YYYY h:mm A")}</small>
              </div>
              <div class="hero">${heroImage ? `<img class=\"hero-img\" src=\"${heroImage}\" />` : ``}</div>
            </div>

            <div class="content">
              <div class="grid">
              ${propertyData.images && propertyData.images.length > 0 ? `
                <div class="card" style="margin-top:14px;">
                  <div class="section-title">Gallery</div>
                  <div class="gallery">
                    ${propertyData.images.map((img) => `<img src="${img}" class="image" />`).join("")}
                  </div>
                </div>` : ""}
                
              <div class="card">
                  <div class="section-title">Description</div>
                  <div class="text">${propertyData.description || "N/A"}</div>
                </div>

                <div class="card">
                  <div class="section-title">Location</div>
                  <div class="info-row"><strong>Address</strong><span>${propertyData.location?.address || "N/A"}</span></div>
                  ${mapsUrl ? `<div style="margin-top:8px"><a class="btn" href="${mapsUrl}">Open in Google Maps</a></div>` : ""}
                </div>
              </div>

              ${propertyData.otherDetails ? `
                <div class="card" style="margin-top:14px;">
                  <div class="section-title">Other Details</div>
                  <div class="text">${propertyData.otherDetails}</div>
                </div>` : ""}

              ${propertyData.notes ? `
                <div class="card" style="margin-top:14px;">
                  <div class="section-title">Notes</div>
                  <div class="text">${propertyData.notes}</div>
                </div>` : ""}
                
              <div class="footer">Smart Rental Manager • Generated PDF</div>
            </div>
          </div>
        </body>
      </html>
    `;

    const timestamp = moment().format("YYYY-MM-DD_HH-mm-ss");
    const safeTitle = (propertyData.title || "Property").replace(/[^a-z0-9_\-]/gi, "_");
    const fileName = `Property_${safeTitle}_${timestamp}`;

    const options = {
      html: htmlContent,
      fileName: fileName,
      directory: "Cache",
      base64: false,
      height: 792,
      width: 612,
      padding: 10,
    } as const;

    const file = await RNHTMLtoPDF.convert(options);
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

    const copiedFileExists = await RNFS.exists(downloadsPath);
    if (!copiedFileExists) {
      throw new Error("Failed to copy PDF to downloads directory");
    }

    try {
      await RNFS.unlink(file.filePath);
    } catch { }

    return downloadsPath;
  } catch (error) {
    console.error("Error generating property PDF:", error);
    throw error;
  }
};