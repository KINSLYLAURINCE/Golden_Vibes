<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Service NotchPay pour paiements mobiles
 * Documentation: https://developer.notchpay.co
 */
class NotchPayService
{
    protected $config;
    protected $baseUrl;

    public function __construct()
    {
        $this->config = config('services.notchpay');
        
        $this->baseUrl = $this->config['mode'] === 'production'
            ? 'https://api.notchpay.co'
            : 'https://api.notchpay.co'; // Même URL, les clés déterminent l'env
    }

    /**
     * Initier un paiement
     */
    public function initiatePayment($data)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => $this->config['public_key'],
                'Content-Type' => 'application/json',
            ])->post("{$this->baseUrl}/payments", [
                'amount' => $data['amount'], // Montant en FCFA
                'currency' => 'XAF',
                'description' => $data['description'],
                'reference' => $data['transaction_id'], // Votre ID unique
                'email' => $data['email'] ?? 'client@goldenvibes.cm',
                'phone' => $data['phone'], // Format: 237xxxxxxxxx
                'callback' => $this->config['webhook_url'],
            ]);

            $result = $response->json();

            Log::info('NotchPay - Paiement initié', $result);

            if (isset($result['transaction']['reference'])) {
                return [
                    'success' => true,
                    'payment_url' => $result['authorization_url'],
                    'reference' => $result['transaction']['reference'],
                    'transaction_id' => $data['transaction_id'],
                ];
            }

            return [
                'success' => false,
                'error' => $result['message'] ?? 'Erreur inconnue',
            ];

        } catch (\Exception $e) {
            Log::error('NotchPay - Exception', [
                'message' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Vérifier le statut d'un paiement
     */
    public function verifyPayment($reference)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => $this->config['public_key'],
            ])->get("{$this->baseUrl}/payments/{$reference}");

            $result = $response->json();

            if (isset($result['transaction'])) {
                return [
                    'status' => $result['transaction']['status'], // complete, pending, failed
                    'amount' => $result['transaction']['amount'],
                    'currency' => $result['transaction']['currency'],
                    'reference' => $reference,
                    'customer' => $result['transaction']['customer'],
                ];
            }

            return null;

        } catch (\Exception $e) {
            Log::error('NotchPay - Erreur vérification', [
                'reference' => $reference,
                'error' => $e->getMessage()
            ]);

            return null;
        }
    }
}