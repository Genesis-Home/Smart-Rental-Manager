export const buildVisitConfirmationHtml = (data: {
  clientName: string;
  phoneNum: string;
  email: string;
  visitDates: string;
  checkInTime: string;
  checkOutTime: string;
  numberOfVisitors?: string;
  numberOfInfants?: string;
  property: string;
  location: { address: string; lat: number; long: number };
  agreedPrice: string;
  advanceAmount?: string;
  balanceAmount?: string;
  images?: string[];
  otherDetails?: string;
}) => {
  const mapsUrl = data.location?.lat && data.location?.long
    ? `https://www.google.com/maps/search/?api=1&query=${data.location.lat},${data.location.long}`
    : "";

  const gallery = (data.images || []).slice(0, 6);

  return `
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        body{margin:0;padding:0;background:#f6f8fa;font-family:Arial,Helvetica,sans-serif;color:#222}
        .container{max-width:640px;margin:0 auto;background:#ffffff}
        .header{padding:20px 24px;border-bottom:1px solid #eef2f5;display:flex;align-items:center;justify-content:space-between}
        .brand{font-size:18px;font-weight:700;color:#24A69E}
        .content{padding:20px 24px}
        h1{font-size:20px;margin:0 0 12px;color:#111}
        h2{font-size:16px;margin:16px 0 8px;color:#24A69E}
        p{margin:6px 0;line-height:1.6}
        .card{border:1px solid #eef2f5;border-radius:10px;padding:14px;margin:8px 0;background:#fafcfd}
        .row{display:flex;gap:12px;flex-wrap:wrap}
        .pill{display:inline-block;padding:6px 10px;border-radius:999px;border:1px solid #cbecea;background:#f4fffe;color:#24A69E;font-size:12px}
        .btn{display:inline-block;background:#24A69E;color:#fff;text-decoration:none;padding:10px 14px;border-radius:8px;font-weight:600}
        .muted{color:#657786;font-size:12px}
        .gallery{display:flex;gap:8px;flex-wrap:wrap}
        .img{width:30%;max-width:180px;aspect-ratio:1/1;border-radius:8px;object-fit:cover;background:#eee}
        @media(max-width:640px){.img{width:47%}}
        .footer{padding:16px 24px;border-top:1px solid #eef2f5;text-align:center}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="brand">Smart Rental Manager</div>
          <span class="pill">Visit Confirmed</span>
        </div>
        <div class="content">
          <h1>Client Visit Details</h1>
          <div class="card">
            <p><strong>Client:</strong> ${data.clientName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phoneNum}</p>
          </div>
          <h2>Visit</h2>
          <div class="card">
            <p><strong>Dates:</strong> ${data.visitDates}</p>
            <p><strong>Check-in:</strong> ${data.checkInTime}</p>
            <p><strong>Check-out:</strong> ${data.checkOutTime}</p>
            ${data.numberOfVisitors ? `<p><strong>Visitors:</strong> ${data.numberOfVisitors}</p>` : ""}
            ${data.numberOfInfants ? `<p><strong>Infants:</strong> ${data.numberOfInfants}</p>` : ""}
          </div>
          <h2>Property</h2>
          <div class="card">
            <p><strong>Name/ID:</strong> ${data.property}</p>
            <p><strong>Address:</strong> ${data.location.address}</p>
            ${mapsUrl ? `<p><a class="btn" href="${mapsUrl}" target="_blank">Open in Google Maps</a></p>` : ""}
          </div>
          <h2>Financials</h2>
          <div class="card">
            <p><strong>Agreed Price:</strong> ${data.agreedPrice}</p>
            <p><strong>Down Payment:</strong> ${data.advanceAmount || "0"}</p>
            ${data.balanceAmount ? `<p><strong>Balance:</strong> ${data.balanceAmount}</p>` : ""}
          </div>
          ${data.otherDetails ? `<h2>Other Details</h2><div class="card"><p>${data.otherDetails}</p></div>` : ""}
          ${gallery.length ? `
            <h2>Gallery</h2>
            <div class="gallery">
              ${gallery.map(src => `<img class="img" src="${src}" alt="Property Image" />`).join("")}
            </div>
          ` : ""}
          <p class="muted">A PDF copy is attached for your records.</p>
        </div>
        <div class="footer">
          <div class="muted">© ${new Date().getFullYear()} Smart Rental Manager</div>
        </div>
      </div>
    </body>
  </html>`;
};


