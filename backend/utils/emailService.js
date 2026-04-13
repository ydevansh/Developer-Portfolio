import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendContactEmail = async (name, email, subject, message) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #001f3f;">New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <h3>Message:</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <small style="color: #666;">Reply-to: ${email}</small>
        </div>
      `,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to admin');
    return true;
  } catch (error) {
    console.error('❌ Email sending error:', error);
    return false;
  }
};

export default sendContactEmail;
