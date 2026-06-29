<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;
use Firebase\JWT\JWT;

class Auth extends ResourceController
{
    protected $modelName = UserModel::class;
    protected $format = 'json';

    public function login()
    {
        // Debug: log request
        log_message('debug', 'Auth::login called');
        
        // Get JSON input
        $json = $this->request->getJSON(true);
        log_message('debug', 'JSON: ' . print_r($json, true));
        
        // Get POST input
        $post = $this->request->getPost();
        log_message('debug', 'POST: ' . print_r($post, true));
        
        // Get username and password
        $username = null;
        $password = null;
        
        if ($json && isset($json['username'])) {
            $username = $json['username'];
            $password = $json['password'];
        } elseif ($post && isset($post['username'])) {
            $username = $post['username'];
            $password = $post['password'];
        }

        // Validate
        if (!$username || !$password) {
            return $this->respond([
                'status' => false,
                'message' => 'Username and password required'
            ], 400);
        }

        // Find user
        $user = $this->model->getUserByUsername($username);

        if (!$user) {
            log_message('debug', 'User not found: ' . $username);
            return $this->respond([
                'status' => false,
                'message' => 'User not found'
            ], 401);
        }

        // Verify password
        log_message('debug', 'Password verify for user: ' . $username);
        if (!password_verify($password, $user['password'])) {
            log_message('debug', 'Password invalid for user: ' . $username);
            return $this->respond([
                'status' => false,
                'message' => 'Invalid password'
            ], 401);
        }

        // Generate JWT Token
        $key = getenv('JWT_SECRET_KEY') ?: 'your-secret-key';
        $payload = [
            'user_id' => $user['id'],
            'username' => $user['username'],
            'role' => $user['role'],
            'iat' => time(),
            'exp' => time() + 3600
        ];

        $token = JWT::encode($payload, $key, 'HS256');

        return $this->respond([
            'status' => true,
            'message' => 'Login successful',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'full_name' => $user['full_name'],
                    'email' => $user['email'],
                    'role' => $user['role']
                ]
            ]
        ]);
    }

    public function logout()
    {
        return $this->respond([
            'status' => true,
            'message' => 'Logout successful'
        ]);
    }

    public function me()
    {
        $authHeader = $this->request->getHeader('Authorization');
        if (!$authHeader) {
            return $this->respond([
                'status' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $token = str_replace('Bearer ', '', $authHeader->getValue());
        
        try {
            $key = getenv('JWT_SECRET_KEY') ?: 'your-secret-key';
            $decoded = JWT::decode($token, new \Firebase\JWT\Key($key, 'HS256'));
            
            $user = $this->model->getUserById($decoded->user_id);
            
            if (!$user) {
                return $this->respond([
                    'status' => false,
                    'message' => 'User not found'
                ], 404);
            }

            return $this->respond([
                'status' => true,
                'data' => [
                    'user' => [
                        'id' => $user['id'],
                        'username' => $user['username'],
                        'full_name' => $user['full_name'],
                        'email' => $user['email'],
                        'role' => $user['role']
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return $this->respond([
                'status' => false,
                'message' => 'Invalid token'
            ], 401);
        }
    }
}