using Application.Interfaces;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Infrastructure.Email
{
    public class SendGridEmailSender : IEmailSender
    {
        private readonly IConfiguration _config;
        public SendGridEmailSender(IConfiguration config)
        {
            this._config = config;
        }

        public async Task SendEmailAsync(string userEmail, string stringSubject, string msg)
        {
            var client = new SendGridClient(_config["SendGrid:Key"]);
            var message = new SendGridMessage
            {
                From = new EmailAddress("davidrandoll9@gmail.com", _config["SendGrid:User"]),
                Subject = stringSubject,
                PlainTextContent = msg,
                HtmlContent = msg
            };

            message.AddTo(new EmailAddress(userEmail));
            message.SetClickTracking(false, false);

            await client.SendEmailAsync(message);
        }
    }
}