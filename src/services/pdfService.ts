import RNHTMLtoPDF from "react-native-html-to-pdf";
import RNFS from "react-native-fs";
import moment from "moment";
import { Share, Platform } from "react-native";
export const generateSchedulePDF = async (scheduleData: any) => {
  try {
    // const htmlContent = `
    //   <html>
    //     <head>
    //       <style>
    //         body { font-family: Arial; padding: 20px; }
    //         .header { margin-bottom: 30px; }
    //         .invoice-title { font-size: 27px; color: #24A69E; text-align: center; margin-bottom: 10px; }
    //         .invoice-details { font-size: 17px; margin-bottom: 20px; display: flex; justify-content: space-between; }
    //         .invoice-details span { font-weight: bold; }
    //         .section { margin-bottom: 20px; }
    //         .section-title { font-size: 22px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
    //         .customer-info div { margin-bottom: 8px; }
    //         .customer-info .label { font-weight: bold; color: #333; display: inline-block; width: 100px; }
    //         .customer-info .value { color: #666; }
    //         table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
    //         th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
    //         th { background-color: #f2f2f2; }
    //         .table-label { font-weight: bold; color: #333; }
    //         .table-value { color: #666; text-align: left; }
    //         .total-row td { font-weight: bold; }
    //         .notes-content { 
    //           padding: 10px; 
    //           background-color: #f9f9f9; 
    //           border: 1px solid #eee; 
    //           border-radius: 5px; 
    //           margin-top: 10px;
    //           white-space: pre-wrap;
    //           line-height: 1.5;
    //         }
    //         .footer { margin-top: 40px; text-align: center; color: #666; font-size: 16px; }
    //         .gallery-section { margin-top: 30px; }
    //         .gallery-title { font-size: 19px; font-weight: bold; color: #24A69E; margin-bottom:10px}
    //         .gallery-grid { display: flex; flex-wrap: wrap; gap: 8px; }
    //         .gallery-img-box { width: 20%; margin-bottom: 8px; }
    //         .gallery-img { width: 100%; aspect-ratio: 1/1; object-fit: cover; border-radius: 8px; background: #eee; }
    //       </style>
    //     </head>
    //     <body>
    //       <div class="header">
    //         <div class="invoice-title">Invoice</div>
    //         <div class="invoice-details">
    //           <div><span>Invoice ID:</span> ${scheduleData.id || "N/A"}</div>
    //           <div><span>Invoice Date:</span> ${moment().format("MMMM D, YYYY")}</div>
    //         </div>
    //       </div>

    //       <div class="section">
    //         <div class="section-title">Customer Information</div>
    //         <div class="customer-info">
    //           <div><span class="label">Name:</span> <span class="value">${scheduleData.clientName}</span></div>
    //           <div><span class="label">Email:</span> <span class="value">${scheduleData.email}</span></div>
    //           <div><span class="label">Phone:</span> <span class="value">${scheduleData.phoneNum}</span></div>
    //         </div>
    //       </div>

    //       <div class="section">
    //         <div class="section-title">Visit Details</div>
    //         <table>
    //           <tr><td class="table-label">Property Name:</td><td class="table-value">${scheduleData.property}</td></tr>
    //           <tr><td class="table-label">Location:</td><td class="table-value">${scheduleData.location?.address}</td></tr>
    //           <tr><td class="table-label">Visit Dates:</td><td class="table-value">${scheduleData.visitDates}</td></tr>
    //           <tr><td class="table-label">Check In Time:</td><td class="table-value">${scheduleData.checkInTime}</td></tr>
    //           <tr><td class="table-label">Check Out Time:</td><td class="table-value">${scheduleData.checkOutTime}</td></tr>
    //           ${scheduleData.numberOfVisitors ? `<tr><td class="table-label">Number of Visitors:</td><td class="table-value">${scheduleData.numberOfVisitors}</td></tr>` : ""}
    //           ${scheduleData.numberOfInfants ? `<tr><td class="table-label">Number of Infants:</td><td class="table-value">${scheduleData.numberOfInfants}</td></tr>` : ""}
    //           ${scheduleData.otherDetails ? `<tr><td class="table-label">Details For Customer:</td><td class="table-value">${scheduleData.otherDetails}</td></tr>` : ""}
    //         </table>
    //       </div>

    //       <div class="section">
    //         <div class="section-title">Financial Details</div>
    //         <table>
    //           <tr><td class="table-label">Agreed Price:</td><td class="table-value">${scheduleData.agreedPrice}</td></tr>
    //           <tr><td class="table-label">Down Payment:</td><td class="table-value">${scheduleData.advanceAmount || "0"}</td></tr>
    //           <tr><td class="table-label">Balance Amount:</td><td class="table-value">${parseFloat(scheduleData.agreedPrice || "0") - parseFloat(scheduleData.advanceAmount || "0")}</td></tr>
    //         </table>
    //       </div>

    //       ${scheduleData.notes ? `
    //         <div class="section">
    //           <div class="section-title">Notes</div>
    //           <div class="notes-content">${scheduleData.notes}</div>
    //         </div>` : ""}

    //       ${scheduleData.imagesAfter && scheduleData.imagesAfter.length > 0 ? `
    //         ${scheduleData.imagesAfter.map((img: string, index: number) => `
    //           <div style="
    //             page-break-after: avoid;
    //             page-break-inside: avoid;
    //             height: 80vh;
    //             min-height: 80vh;
    //             max-height: 80vh;
    //             display: flex;
    //             flex-direction: column;
    //             justify-content: center;
    //             align-items: center;
    //             border-radius: 15px;
    //             background: #ffffff;
    //             padding: 25px;
    //             margin: 10mm;
    //             box-sizing: border-box;
    //           ">
    //             ${index === 0 ? '<div class="gallery-title">Property Images (After Booking)</div>' : ''}
    //             <img src="${img}" style="
    //               width: 85%;
    //               height: 75%;
    //               object-fit: contain;
    //               border-radius: 10px;
    //               background: #f8f8f8;
    //               box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    //             " />
    //           </div>
    //         `).join('')}
    //       ` : ""}

    //       <div class="footer">
    //         <p>Generated on ${moment().format("MMMM D, YYYY h:mm A")}</p>
    //         <p>Thank you for choosing our service!</p>
    //       </div>
    //     </body>
    //   </html>
    // `;

    const htmlContent = `
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding: 30px; 
            font-size: 22px; 
            color: #111;
          }
          .header { margin-bottom: 40px; }
          .invoice-title { 
            font-size: 38px; 
            color: #24A69E; 
            text-align: center; 
            font-weight: 800; 
            margin-bottom: 20px; 
          }
          .invoice-details { 
            font-size: 24px; 
            font-weight: bold;
            margin-bottom: 30px; 
            display: flex; 
            justify-content: space-between; 
          }
          .invoice-details span { font-weight: 900; color: #000; }
          .section { margin-bottom: 30px; }
          .section-title { 
            font-size: 28px; 
            font-weight: 900; 
            margin-bottom: 15px; 
            border-bottom: 3px solid #ccc; 
            padding-bottom: 8px; 
            color: #000;
          }
          .customer-info div { 
            margin-bottom: 12px; 
            font-size: 23px;
          }
          .customer-info .label { 
            font-weight: 900; 
            color: #000; 
            display: inline-block; 
            width: 150px; 
          }
          .customer-info .value { 
            color: #333; 
            font-weight: 700;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 25px; 
            font-size: 23px; 
          }
          th, td { 
            padding: 12px; 
            border: 2px solid #bbb; 
            text-align: left; 
          }
          th { 
            background-color: #f2f2f2; 
            font-weight: 900; 
            font-size: 24px;
          }
          .table-label { 
            font-weight: 900; 
            color: #000; 
            width: 40%;
          }
          .table-value { 
            color: #333; 
            font-weight: 700;
            white-space: pre-wrap;
            line-height: 1.6;
            word-break: break-word;
          }
          .total-row td { font-weight: 900; font-size: 24px; }
          .notes-content { 
            padding: 15px; 
            background-color: #f9f9f9; 
            border: 2px solid #ccc; 
            border-radius: 8px; 
            margin-top: 15px;
            white-space: pre-wrap;
            line-height: 1.8;
            font-size: 22px;
            font-weight: 600;
          }
          .footer { 
            margin-top: 55px; 
            text-align: center; 
            color: #444; 
            font-size: 22px; 
            font-weight: bold;
          }
          .gallery-section { margin-top: 40px; }
          .gallery-title { 
            font-size: 26px; 
            font-weight: 900; 
            color: #24A69E; 
            margin-bottom: 15px;
            text-align: center;
          }
          .gallery-img-box { width: 25%; margin-bottom: 10px; }
          .gallery-img { 
            width: 100%; 
            aspect-ratio: 1/1; 
            object-fit: cover; 
            border-radius: 12px; 
            background: #eee; 
            border: 2px solid #ccc;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="invoice-title">Invoice</div>
          <div class="invoice-details">
            <div><span>Invoice ID:</span> ${scheduleData.id || "N/A"}</div>
            <div><span>Invoice Date:</span> ${moment().format("MMMM D, YYYY")}</div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Customer Information</div>
          <div class="customer-info">
            <div><span class="label">Name:</span> <span class="value">${scheduleData.clientName}</span></div>
            <div><span class="label">Email:</span> <span class="value">${scheduleData.email}</span></div>
            <div><span class="label">Phone:</span> <span class="value">${scheduleData.phoneNum}</span></div>
          </div>
        </div>
      
        <div class="section">
          <div class="section-title">Visit Details</div>
          <table>
            <tr><td class="table-label">Property Name:</td><td class="table-value">${scheduleData.property}</td></tr>
            <tr><td class="table-label">Location:</td><td class="table-value">${scheduleData.location?.address}</td></tr>
            <tr><td class="table-label">Visit Dates:</td><td class="table-value">${scheduleData.visitDates}</td></tr>
            <tr><td class="table-label">Check In Time:</td><td class="table-value">${scheduleData.checkInTime}</td></tr>
            <tr><td class="table-label">Check Out Time:</td><td class="table-value">${scheduleData.checkOutTime}</td></tr>
            ${scheduleData.otherDetails ? `<tr><td class="table-label">Details For Customer:</td><td class="table-value">${scheduleData.otherDetails}</td></tr>` : ""}
            ${scheduleData.numberOfVisitors ? `<tr><td class="table-label">Number of Visitors:</td><td class="table-value">${scheduleData.numberOfVisitors}</td></tr>` : ""}
            ${scheduleData.numberOfInfants ? `<tr><td class="table-label">Number of Infants:</td><td class="table-value">${scheduleData.numberOfInfants}</td></tr>` : ""}
          </table>
        </div>
      
        <div class="section">
          <div class="section-title">Financial Details</div>
          <table>
            <tr><td class="table-label">Agreed Price:</td><td class="table-value">${scheduleData.agreedPrice}</td></tr>
            <tr><td class="table-label">Down Payment:</td><td class="table-value">${scheduleData.advanceAmount || "0"}</td></tr>
            <tr><td class="table-label">Balance Amount:</td><td class="table-value">${parseFloat(scheduleData.agreedPrice || "0") - parseFloat(scheduleData.advanceAmount || "0")}</td></tr>
          </table>
        </div>
      
        ${scheduleData.notes ? `
          <div class="section">
            <div class="section-title">Notes</div>
            <div class="notes-content">${scheduleData.notes}</div>
          </div>` : ""}
          
        ${scheduleData.imagesAfter && scheduleData.imagesAfter.length > 0 ? `
          ${scheduleData.imagesAfter.map((img, index) => `
            <div style="
              page-break-after: avoid;
              page-break-inside: avoid;
              height: 90vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              border-radius: 20px;
              background: #ffffff;
              padding: 35px;
              margin: 10mm;
              box-sizing: border-box;
            ">
              ${index === 0 ? '<div class="gallery-title">Property Images (After Booking)</div>' : ''}
              <img src="${img}" style="
                width: 90%;
                height: 80%;
                object-fit: contain;
                border-radius: 12px;
                background: #f8f8f8;
                box-shadow: 0 6px 16px rgba(0,0,0,0.2);
              " />
            </div>
          `).join('')}
        ` : ""}
        
        <div class="footer">
          <p>Generated on ${moment().format("MMMM D, YYYY h:mm A")}</p>
          <p>Thank you for choosing our service!</p>
        </div>
      </body>
    </html>`;

    const timestamp = moment().format("YYYY-MM-DD_HH-mm-ss");
    const fileName = `Booking_Invoice_${timestamp}`;

    const options = {
      html: htmlContent,
      fileName: fileName,
      directory: 'Cache',
      base64: false,
      height: 842, // A4 height in points (297mm)
      width: 595,  // A4 width in points (210mm)
      // padding: 10,
    };

    console.log('Generating PDF with options:', options);
    const file = await RNHTMLtoPDF.convert(options);

    if (!file.filePath) throw new Error('PDF generation failed - no file path returned');

    const fileExists = await RNFS.exists(file.filePath);
    if (!fileExists) throw new Error('PDF file not found after generation');

    // ✅ Use app-safe external directory (no permission needed)
    const downloadsPath = `${RNFS.ExternalDirectoryPath}/${fileName}.pdf`;

    await RNFS.copyFile(file.filePath, downloadsPath);
    console.log('PDF saved to:', downloadsPath);

    // Cleanup temp file
    try {
      await RNFS.unlink(file.filePath);
    } catch (cleanupError) {
      console.warn('Failed to clean up temporary PDF file:', cleanupError);
    }

    // ✅ Optional: Automatically share or open the PDF
    try {
      // await Share.share({
      //   url: `file://${downloadsPath}`,
      //   title: 'Booking Invoice PDF',
      // });
    } catch (shareError) {
      console.warn('User canceled share or failed to open PDF:', shareError);
    }

    return downloadsPath;

  } catch (error) {
    console.error('Error generating PDF:', error);
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
}) => {
  try {
    const mapsUrl =
      propertyData.location?.lat && propertyData.location?.long
        ? `https://www.google.com/maps?q=${propertyData.location.lat},${propertyData.location.long}`
        : propertyData.location?.address
          ? `https://www.google.com/maps/search/${encodeURIComponent(propertyData.location.address)}`
          : "";

    const heroImage =
      propertyData.images && propertyData.images.length > 0
        ? propertyData.images[0]
        : "";

    const htmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      @page { 
        size: A4; 
        margin: 0; 
      }
      
      * { 
        margin: 0;
        padding: 0;
        box-sizing: border-box; 
      }
      
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
        color: #1a1a1a;
        background: #ffffff;
        line-height: 1.6;
      }
      
      .page {
        width: 210mm;
        min-height: 297mm;
        padding: 20mm;
        background: white;
      }
      
      .header {
        background: linear-gradient(135deg, #24A69E 0%, #1e8b84 100%);
        color: white;
        padding: 24px 28px;
        border-radius: 12px;
        margin-bottom: 24px;
        box-shadow: 0 2px 8px rgba(36, 166, 158, 0.15);
      }
      
      .header-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }
      
      .property-title {
        font-size: 24px;
        font-weight: 700;
        letter-spacing: -0.5px;
      }
      
      .property-id {
        font-size: 11px;
        opacity: 0.85;
        background: rgba(255,255,255,0.2);
        padding: 4px 10px;
        border-radius: 6px;
      }
      
      .header-date {
        font-size: 12px;
        opacity: 0.9;
        margin-top: 4px;
      }
      
      .hero-section {
        margin-bottom: 24px;
        border-radius: 12px;
        overflow: hidden;
        background: #f5f5f5;
        box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      }
      
      .hero-image {
        width: 100%;
        height: 280px;
        object-fit: cover;
        display: block;
      }
      
      .content-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 20px;
      }
      
      .content-card {
        background: #fafafa;
        border: 1px solid #e8e8e8;
        border-radius: 10px;
        padding: 20px;
        break-inside: avoid;
      }
      
      .card-title {
        color: #24A69E;
        font-size: 15px;
        font-weight: 700;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .card-title::before {
        content: '';
        width: 4px;
        height: 16px;
        background: #24A69E;
        border-radius: 2px;
      }
      
      .card-content {
        font-size: 13px;
        color: #333;
        line-height: 1.7;
        white-space: pre-wrap;
      }
      
      .location-info {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      
      .info-item {
        display: flex;
        gap: 10px;
      }
      
      .info-label {
        font-weight: 600;
        color: #555;
        min-width: 80px;
        font-size: 12px;
      }
      
      .info-value {
        color: #333;
        font-size: 13px;
        flex: 1;
      }
      
      .map-link {
        display: inline-block;
        background: #24A69E;
        color: white;
        padding: 10px 18px;
        border-radius: 8px;
        text-decoration: none;
        font-size: 12px;
        font-weight: 600;
        margin-top: 8px;
      }
      
      .gallery-title {
        color: #24A69E;
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 20px;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .gallery-image {
        width: 85%;
        height: 75%;
        object-fit: contain;
        border-radius: 10px;
        background: #f8f8f8;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }

      @media print {
        .page { margin: 0; box-shadow: none; }
      }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="header">
        <div class="header-top">
          <div class="property-title">${propertyData.title || "Property Details"}</div>
          <div class="property-id">ID: ${propertyData.id}</div>
        </div>
        <div class="header-date">Generated on ${moment().format("MMMM D, YYYY • h:mm A")}</div>
      </div>
      
      ${heroImage ? `
      <div class="hero-section">
        <img class="hero-image" src="${heroImage}" alt="Property" />
      </div>
      ` : ''}

      <div class="content-grid">
        <div class="content-card full-width-card">
          <div class="card-title">Description</div>
          <div class="card-content">${propertyData.description || "No description available"}</div>
        </div>
        
        <div class="content-card">
          <div class="card-title">Location</div>
          <div class="location-info">
            <div class="info-item">
              <span class="info-label">Address:</span>
              <span class="info-value">${propertyData.location?.address || "N/A"}</span>
            </div>
            ${propertyData.location?.lat ? `
            <div class="info-item">
              <span class="info-label">Coordinates:</span>
              <span class="info-value">${propertyData.location.lat}, ${propertyData.location.long || "N/A"}</span>
            </div>
            ` : ''}
            ${mapsUrl ? `
            <a href="${mapsUrl}" class="map-link">📍 Open in Google Maps</a>
            ` : ''}
          </div>
        </div>
        
        ${propertyData.otherDetails ? `
        <div class="content-card">
          <div class="card-title">Other Details</div>
          <div class="card-content">${propertyData.otherDetails}</div>
        </div>
        ` : ''}
      </div>

      ${propertyData.images && propertyData.images.length > 1 ? `
        ${propertyData.images.slice(1).map((img, index) => `
        <br />
        <br />
          <div class="gallery-item-page" style="
            page-break-after: avoid;
            page-break-inside: avoid;
            height: 80vh;
            min-height: 80vh;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 15px;
            background: #ffffff;
            padding: 25px; /* 🟢 Added inner padding */
            margin-top: 25px;
            margin: 10mm;  /* 🟢 Added margin from page edge */
            box-sizing: border-box;
          ">
            ${index === 0 ? '<div class="gallery-title">Property Images (Before Booking)</div>' : ''}
            <img src="${img}" class="gallery-image" alt="Property Image" />
          </div>
        `).join('')}
      ` : ''}
      
      <div class="footer" style="text-align:center;margin-top:40px;">
        <div style="font-weight:700;color:#24A69E;font-size:13px;margin-bottom:4px;">🏢 Smart Rental Manager</div>
        <div style="color:#888;font-size:11px;">Professional Property Management System</div>
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
      directory: Platform.OS === "ios" ? "Documents" : "Downloads",
      base64: false,
      height: 842,
      width: 595,
      padding: 0,
    } as const;

    console.log("🔄 Generating PDF...");
    const file = await RNHTMLtoPDF.convert(options);

    if (!file.filePath) throw new Error("PDF generation failed - no file path returned");

    const fileExists = await RNFS.exists(file.filePath);
    if (!fileExists) throw new Error("PDF file not found after generation");

    const finalPath =
      Platform.OS === "android"
        ? `${RNFS.ExternalDirectoryPath}/${fileName}.pdf`
        : `${RNFS.DocumentDirectoryPath}/${fileName}.pdf`;

    await RNFS.copyFile(file.filePath, finalPath);
    console.log("✅ PDF saved to:", finalPath);

    try {
      await RNFS.unlink(file.filePath);
    } catch (cleanupError) {
      console.warn("⚠️ Failed to clean up temporary PDF:", cleanupError);
    }

    const finalExists = await RNFS.exists(finalPath);
    if (!finalExists) throw new Error("Final PDF file not found at: " + finalPath);

    const fileStats = await RNFS.stat(finalPath);
    console.log("📄 PDF file size:", fileStats.size, "bytes");

    return finalPath;
  } catch (error) {
    console.error("❌ Error generating property PDF:", error);
    throw error;
  }
};
