using Application.Interfaces;

namespace Infrastructure.Email
{
    public class MockEmailSender : IEmailSender
    {
        public Task SendEmailAsync(string userEmail, string stringSubject, string msg)
        {
            Console.WriteLine("Sending email to: " + userEmail);
            Console.WriteLine("Subject: " + stringSubject);
            Console.WriteLine("Message: " + msg);
            return Task.CompletedTask;
        }
    }
}