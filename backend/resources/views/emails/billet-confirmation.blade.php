<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #000000 0%, #333333 100%);
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            color: #FFD700;
            margin: 0;
            font-size: 28px;
        }
        .content {
            padding: 40px 30px;
        }
        .code-box {
            background-color: #000000;
            border: 3px solid #FFD700;
            border-radius: 8px;
            padding: 25px;
            text-align: center;
            margin: 30px 0;
        }
        .code-label {
            color: #FFD700;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 10px;
        }
        .code {
            color: #00ff62;
            font-size: 32px;
            font-weight: bold;
            font-family: 'Courier New', monospace;
            letter-spacing: 3px;
            margin: 10px 0;
        }
        .info-table {
            width: 100%;
            margin: 20px 0;
            border-collapse: collapse;
        }
        .info-table td {
            padding: 12px;
            border-bottom: 1px solid #eeeeee;
        }
        .info-table td:first-child {
            font-weight: bold;
            color: #333333;
            width: 40%;
        }
        .info-table td:last-child {
            color: #666666;
        }
        .warning-box {
            background-color: #fff9e6;
            border-left: 4px solid #FFD700;
            padding: 20px;
            margin: 25px 0;
        }
        .warning-box h3 {
            color: #000000;
            margin-top: 0;
            font-size: 16px;
        }
        .warning-box ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        .warning-box li {
            margin: 8px 0;
            color: #333333;
        }
        .footer {
            background-color: #f8f8f8;
            padding: 25px;
            text-align: center;
            font-size: 12px;
            color: #999999;
        }
        .footer p {
            margin: 5px 0;
        }
        .event-details {
            background-color: #f5f5f5;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>GOLDEN VIBES EVENTS</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <h2 style="color: #000000; margin-top: 0;">Bonjour {{ $billet->nom_client }},</h2>
            
            <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                Merci pour votre achat ! Votre paiement a été confirmé avec succès.
            </p>

            <!-- Code Billet -->
            <div class="code-box">
                <div class="code-label">VOTRE CODE BILLET</div>
                <div style="border-bottom: 2px solid #FFD700; margin: 15px 50px;"></div>
                <div class="code">{{ $billet->qr_code }}</div>
                <div style="border-bottom: 2px solid #FFD700; margin: 15px 50px;"></div>
            </div>

            <!-- Informations Billet -->
            <table class="info-table">
                <tr>
                    <td>Pack :</td>
                    <td><strong style="color: #FFD700; font-size: 18px;">{{ $billet->pack->nom }}</strong></td>
                </tr>
                <tr>
                    <td>Nombre de billets :</td>
                    <td>{{ $billet->quantite }} {{ $billet->quantite > 1 ? 'personnes' : 'personne' }}</td>
                </tr>
                <tr>
                    <td>Montant payé :</td>
                    <td><strong>{{ number_format($billet->montant_total, 0, '', ' ') }} FCFA</strong></td>
                </tr>
                <tr>
                    <td>Mode de paiement :</td>
                    <td style="text-transform: uppercase;">{{ $billet->mode_paiement }}</td>
                </tr>
                <tr>
                    <td>Référence :</td>
                    <td style="font-family: monospace; font-size: 12px;">{{ $billet->transaction_id }}</td>
                </tr>
            </table>

            <!-- Avertissement Important -->
            <div class="warning-box">
                <h3>⚠️ IMPORTANT - Jour de l'événement :</h3>
                <ul>
                    <li>✅ Présentez ce <strong>CODE</strong> à l'entrée</li>
                    <li>📱 Vous pouvez le montrer sur votre téléphone</li>
                    <li>🗣️ Ou simplement le dire à l'agent</li>
                    <li>💾 Gardez cet email précieusement</li>
                </ul>
            </div>

            <!-- Détails Événement -->
            <div class="event-details">
                <h3 style="color: #000000; margin-top: 0;">📅 Détails de l'événement</h3>
                <p style="margin: 8px 0; color: #333333;">
                    <strong>Date :</strong> 15 Mars 2026<br>
                    <strong>Heure :</strong> 18h00<br>
                    <strong>Lieu :</strong> Palais des Congrès<br>
                    <strong>Ville :</strong> Douala, Cameroun
                </p>
            </div>

            <p style="color: #666666; font-size: 14px; margin-top: 30px;">
                Pour toute question, contactez-nous à 
                <a href="mailto:contact@goldenvibes.cm" style="color: #FFD700;">contact@goldenvibes.cm</a>
            </p>

            <p style="color: #000000; font-size: 16px; margin-top: 30px;">
                À très bientôt ! 🎉
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Golden Vibes Events</strong></p>
            <p>L'événement culturel de l'année</p>
            <p style="margin-top: 15px;">
                © 2026 Golden Vibes Events - Tous droits réservés
            </p>
        </div>
    </div>
</body>
</html>