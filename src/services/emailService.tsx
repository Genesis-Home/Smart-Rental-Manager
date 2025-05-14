import axios from "axios";

interface SendEmailRequest {
  recipientEmail: string;
  clientName: string;
  visitDates: string;
  visitTime: string;
  property: string;
}

export async function sendEmailAPI(formData: SendEmailRequest): Promise<any> {
  const data: SendEmailRequest = {
    recipientEmail: formData.recipientEmail,
    clientName: formData.clientName,
    visitDates: formData.visitDates,
    visitTime: formData.visitTime,
    property: formData.property,
  };

  try {
    const response = await axios.post(
      "https://us-central1-smartrental-8c487.cloudfunctions.net/sendEmail",
      data
    );
    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
