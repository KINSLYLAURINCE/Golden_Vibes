<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NotchPayService
{
    private $publicKey;
    private $secretKey;
    private $baseUrl;

    public function __construct()
    {
        $this->publicKey = config('services.notchpay.public_key');
        $this->secretKey = config('services.notchpay.secret_key');
        $this->baseUrl = 'https://api.notchpay.co';
    }

    public function initiatePayment($data)
    {
        try {
            // URL frontend en local ou production
            $frontendUrl = config('app.env') === 'production' 
                ? 'https://goldenvibes-event.com' 
                : 'http://localhost:3000';
            
            $response = Http::withHeaders([
                'Authorization' => $this->publicKey,
                'Accept' => 'application/json',
                'Content-Type' => 'application/json'
            ])->post("{$this->baseUrl}/payments/initialize", [
                'amount' => $data['amount'],
                'currency' => 'XAF',
                'email' => 'contact@goldenvibes.com',
                'phone' => $data['phone'],
                'description' => $data['description'],
                'reference' => $data['transaction_id'],
                
                // URLs de redirection
                'callback' => $frontendUrl . '/vote/success?transaction=' . $data['transaction_id'],
                'return_url' => $frontendUrl . '/vote/success?transaction=' . $data['transaction_id'],
                'cancel_url' => $frontendUrl . '/vote/cancel?transaction=' . $data['transaction_id'],
            ]);

            Log::info('NotchPay Initiate Response', [
                'status' => $response->status(),
                'body' => $response->json()
            ]);

            if ($response->successful()) {
                $result = $response->json();
                return [
                    'success' => true,
                    'payment_url' => $result['authorization_url'] ?? null,
                    'reference' => $result['transaction']['reference'] ?? null
                ];
            }

            Log::error('NotchPay Init Failed', [
                'status' => $response->status(),
                'error' => $response->body()
            ]);

            return [
                'success' => false,
                'error' => $response->json()['message'] ?? 'Erreur paiement'
            ];

        } catch (\Exception $e) {
            Log::error('NotchPay Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Vérifier le statut d'une transaction NotchPay
     */
    public function verifyPayment($reference)
    {
        try {
            Log::info('NotchPay Verify Payment', ['reference' => $reference]);

            $response = Http::withHeaders([
                'Authorization' => $this->publicKey,
                'Accept' => 'application/json',
            ])->get("{$this->baseUrl}/payments/{$reference}");

            Log::info('NotchPay Verify Response', [
                'status' => $response->status(),
                'body' => $response->json()
            ]);

            if ($response->successful()) {
                $result = $response->json();
                $transaction = $result['transaction'] ?? $result;
                
                return [
                    'success' => true,
                    'status' => $transaction['status'] ?? 'unknown',
                    'reference' => $transaction['reference'] ?? $reference,
                    'amount' => $transaction['amount'] ?? 0,
                ];
            }

            return [
                'success' => false,
                'error' => 'Impossible de vérifier le paiement'
            ];

        } catch (\Exception $e) {
            Log::error('NotchPay Verify Exception', ['message' => $e->getMessage()]);
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
}