import smtplib, ssl
import os
from email.message import EmailMessage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

port = os.getenv("SMTP_PORT")  # For SSL
password = os.getenv("SENDER_PASSWORD")
email = os.getenv("SENDER_EMAIL")
smtp_email = os.getenv("SMTP_EMAIL")

# Create a secure SSL context
context = ssl.create_default_context()

"""
    @docs
    This service is used to send emails.

    visit: https://realpython.com/python-send-email/
    To see how email messages can be sent
"""

class MailService:
    def __init__(self) -> None:
        print("Mail Service initialized...")

    """
        @message: plaintext or html
    """
    def send_mail(self, **kwargs) -> None:
        try:
            receiver_email = kwargs.get("receiver_email")
            message = kwargs.get("message")
            subject = kwargs.get("subject")
            is_html = kwargs.get("is_html")

            if not message or not receiver_email:
                raise "Missing message or receiver email"

            if is_html == True:
                email_msg = MIMEMultipart()
            else:
                email_msg = EmailMessage()

            email_msg["from"] = email
            email_msg["to"] = receiver_email
            if subject:
                email_msg["subject"] = subject

            if is_html == True:
                email_msg.attach(MIMEText(message, 'html'))
                email_string = email_msg.as_string()
            else:
                email_msg.set_content(message)
                email_string = email_msg

            self.__send_mail(email_string, receiver_email)
        except Exception as e:
            print("Unable to send email: ", e)
            return

    def __send_mail(self, message, receiver_email):
        try:
            context = ssl.create_default_context()
            with smtplib.SMTP_SSL(smtp_email, int(port), context=context) as server:
                server.login(email, password)
                server.sendmail(email, receiver_email, message)
                print(f"Email successfully sent with contents: {message}")
        except Exception as e:
            raise e

mailer = MailService()