import os
import smtplib
import imaplib
import email
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

class GmailManager:
    def __init__(self, email_address, app_password):
        self.email_address = email_address
        self.app_password = app_password
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 465
        self.imap_server = "imap.gmail.com"

    def send_email(self, to_email, subject, body, thread_id=None, message_id=None):
        msg = MIMEMultipart()
        msg['From'] = self.email_address
        msg['To'] = to_email
        msg['Subject'] = subject

        if thread_id and message_id:
            # Native threading headers
            msg['In-Reply-To'] = message_id
            msg['References'] = message_id
            if not subject.lower().startswith("re:"):
                msg['Subject'] = "Re: " + subject

        msg.attach(MIMEText(body, 'html'))

        try:
            with smtplib.SMTP_SSL(self.smtp_server, self.smtp_port) as server:
                server.login(self.email_address, self.app_password)
                server.send_message(msg)
            return True, msg['Message-ID']
        except Exception as e:
            print(f"Error sending email: {e}")
            return False, None

    def check_for_replies(self):
        """
        Connects via IMAP to check for new replies in the inbox.
        """
        replies = []
        try:
            mail = imaplib.IMAP4_SSL(self.imap_server)
            mail.login(self.email_address, self.app_password)
            mail.select("inbox")

            # Search for unread emails
            status, messages = mail.search(None, 'UNSEEN')
            if status == "OK":
                for num in messages[0].split():
                    status, data = mail.fetch(num, '(RFC822)')
                    if status == "OK":
                        raw_email = data[0][1]
                        msg = email.message_from_bytes(raw_email)
                        sender = email.utils.parseaddr(msg['From'])[1]
                        replies.append({
                            "sender": sender,
                            "subject": msg['Subject'],
                            "thread_id": msg['Thread-Index'] # simplified
                        })
            mail.close()
            mail.logout()
        except Exception as e:
            print(f"Error checking replies: {e}")
        
        return replies
