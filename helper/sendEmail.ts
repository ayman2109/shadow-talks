import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any email service provider
  auth: {
    user: 'mohd.aymanhussain2109@gmail.com', // Your email
    pass: process.env.EMAIL_KEY
  },
});


export async function sendVerificationCode(
    email: string,
    username: string,
    verifyCode: string
) : Promise<VerificationEmailApiResponse>{


  const mailOptions = {
    from: 'mohd.aymanhussain2109@gmail.com', // Sender's email
    to: email, // Recipient's email
    subject: "VERFICATION CODE FROM SHADOWTALKS", // Email subject
    text: `${username} this is your code`, // Plain text body
    html: `<b>${verifyCode}</b>` // Optionally, an HTML body
  };

  
    try {
      const response = await transporter.sendMail(mailOptions);
      return { success: true, message: 'Verification code send successfully'}
    } catch (error) {
      console.log(error)
      return {success: false, message: "Error While sending verification code"}
    }
  }


interface VerificationEmailApiResponse {
    success: boolean,
    message: string
}