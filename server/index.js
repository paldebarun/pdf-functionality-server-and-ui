const express = require('express');
const PDFDocument = require('pdfkit');
const cors = require('cors');

const app = express();

// Use CORS middleware
app.use(cors());

// Use JSON middleware to parse incoming JSON requests
app.use(express.json());

// Function to create PDF with dynamic data
const createPDF = (doc, data) => {
  // Add a title
  doc.fontSize(25).text('CERTIFICATE', { align: 'center' });

  // Add a subtitle
  doc.fontSize(18).text('OF INTERNSHIP', { align: 'center', margin: 20 });

  // Add a horizontal line
  doc.moveTo(50, 100).lineTo(550, 100).stroke();

  // Add certificate recipient
  doc.fontSize(18).text('THE FOLLOWING CERTIFICATE IS GIVEN TO', { align: 'center', margin: 20 });

  // Add recipient name from JSON data
  doc.fontSize(22).text(data.recipientName, { align: 'center', margin: 20, underline: true });

  // Add body text using JSON data
  doc.moveDown().fontSize(12).text(
    `We are happy to certify that Mr. ${data.recipientName} has completed his Remote Internship as a "${data.internshipRole}" from ${data.startDate} to ${data.endDate}. He has fulfilled all the expectations during the Internship & worked on different business projects.`,
    { align: 'center', margin: 20 }
  );

  // Add company name
  doc.moveDown().fontSize(16).text(data.companyName, { align: 'center', margin: 20, bold: true });

  // Add footer
  doc.moveDown().fontSize(14).text('Founder CEO & Managing Director', { align: 'center', margin: 20 });
  doc.fontSize(18).text(data.ceoName, { align: 'center', margin: 20 });

  // Add signature
  doc.moveDown().fontSize(14).text(data.signatureName, { align: 'center', margin: 20 });
  doc.fontSize(12).text('UDYAM-UP-46-0007802 \nMinistry of MSME', { align: 'center', margin: 20 });
};

// Route to generate PDF using JSON data
app.post('/generate-pdf', (req, res) => {
  const jsonData = req.body;

  // Validate incoming data
  if (!jsonData.recipientName || !jsonData.internshipRole || !jsonData.startDate || !jsonData.endDate || !jsonData.companyName || !jsonData.ceoName || !jsonData.signatureName) {
    return res.status(400).send('Invalid data provided.');
  }

  // Create a new PDF document
  const doc = new PDFDocument();

  // Set the response to 'application/pdf'
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="certificate.pdf"');

  // Pipe the PDF document to the response
  doc.pipe(res);

  // Create the PDF using the template function and JSON data
  createPDF(doc, jsonData);

  // Finalize the PDF and end the stream
  doc.end();
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
