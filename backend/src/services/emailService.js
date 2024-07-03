const Resend = require('resend').Resend;
const resend = new Resend('re_73Fw5gk9_GySuHaVLyPu6Et5Np3f4KNha');


async function sendVerificationEmail(userName, verificationToken, userEmail) {
    const activationLink = `http://localhost:8080/activate/${verificationToken}`;
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: userEmail,
            subject: 'Veuillez confirmer votre adresse email',
            text: `Bonjour ${userName},\n\nVeuillez confirmer votre adresse email en cliquant sur le lien suivant: ${activationLink}\n\nSi vous n'avez pas créé de compte, ignorez simplement cet email.`,
        });
        console.log('Verification email sent successfully to ' + userEmail);
    } catch (error) {
        console.error('Failed to send verification email to ' + userEmail, error);
    }
}

async function sendPasswordResetEmail(userName, resetToken, userEmail) {
    const resetLink = `http://localhost:8080/reset-password/${resetToken}`;
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: userEmail,
            subject: 'Réinitialisation de votre mot de passe',
            text: `Bonjour ${userName},\n\nCliquez sur ce lien pour réinitialiser votre mot de passe: ${resetLink}\n\nSi vous n'avez pas demandé de réinitialisation, ignorez cet email.`,
            tags: [
                {
                    name: 'category',
                    value: 'reset_password',
                },
            ],
        });
        console.log('Password reset email sent successfully to ' + userEmail);
    } catch (error) {
        console.error('Failed to send password reset email to ' + userEmail, error);
    }
}

async function sendLockedWarningEmail(userName) {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'alrdalexandre@gmail.com',
            subject: 'Locked account',
            text: `Bonjour ${userName},\n\n Compte bloqué pendant 20 minutes.`,
            tags: [
                {
                    name: 'category',
                    value: 'verify_email',
                },
            ],
        });

        console.log('Locked account email sent successfully to ' + 'alrdalexandre@gmail.com');
    } catch (error) {
        console.error('Locked account email not sent to ' + 'alrdalexandre@gmail.com', error);
    }
}

async function sendSubscriptionNotificationEmail(firstName, email, subject, message) {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'alrdalexandre@gmail.com',
            subject: subject,
            text: `Bonjour ${firstName},\n\n${message}`,
        });
        console.log('Email sent successfully to ' + email);
    } catch (error) {
        console.error('Failed to send email to ' + email, error);
    }
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendLockedWarningEmail, sendSubscriptionNotificationEmail, };
