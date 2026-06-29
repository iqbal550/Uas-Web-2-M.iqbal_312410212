<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ProductModel;

class Product extends ResourceController
{
    protected $modelName = ProductModel::class;
    protected $format = 'json';

    // GET /api/product
    public function index()
    {
        $products = $this->model->getProductsWithRelations();
        
        return $this->respond([
            'status' => true,
            'data' => $products
        ]);
    }

    // GET /api/product/{id}
    public function show($id = null)
    {
        $product = $this->model->getProductById($id);
        
        if (!$product) {
            return $this->respond([
                'status' => false,
                'message' => 'Product not found'
            ], 404);
        }

        return $this->respond([
            'status' => true,
            'data' => $product
        ]);
    }

    // POST /api/product
    public function create()
    {
        $data = $this->request->getJSON(true);
        
        if (!$data || !isset($data['name'])) {
            return $this->respond([
                'status' => false,
                'message' => 'Product name is required'
            ], 400);
        }

        // Generate product code if not provided
        if (!isset($data['code']) || empty($data['code'])) {
            $data['code'] = 'PRD-' . date('Ymd') . '-' . rand(100, 999);
        }

        // Check if code exists
        if ($this->model->where('code', $data['code'])->first()) {
            return $this->respond([
                'status' => false,
                'message' => 'Product code already exists'
            ], 400);
        }

        if (!$this->model->save($data)) {
            return $this->respond([
                'status' => false,
                'message' => 'Failed to create product',
                'errors' => $this->model->errors()
            ], 400);
        }

        $productId = $this->model->getInsertID();
        $newProduct = $this->model->getProductById($productId);

        return $this->respond([
            'status' => true,
            'message' => 'Product created successfully',
            'data' => $newProduct
        ], 201);
    }

    // PUT /api/product/{id}
    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        
        if (!$data) {
            return $this->respond([
                'status' => false,
                'message' => 'Invalid data'
            ], 400);
        }

        $product = $this->model->find($id);
        
        if (!$product) {
            return $this->respond([
                'status' => false,
                'message' => 'Product not found'
            ], 404);
        }

        if (!$this->model->update($id, $data)) {
            return $this->respond([
                'status' => false,
                'message' => 'Failed to update product',
                'errors' => $this->model->errors()
            ], 400);
        }

        $updatedProduct = $this->model->getProductById($id);

        return $this->respond([
            'status' => true,
            'message' => 'Product updated successfully',
            'data' => $updatedProduct
        ]);
    }

    // DELETE /api/product/{id}
    public function delete($id = null)
    {
        $product = $this->model->find($id);
        
        if (!$product) {
            return $this->respond([
                'status' => false,
                'message' => 'Product not found'
            ], 404);
        }

        if (!$this->model->delete($id)) {
            return $this->respond([
                'status' => false,
                'message' => 'Failed to delete product'
            ], 400);
        }

        return $this->respond([
            'status' => true,
            'message' => 'Product deleted successfully'
        ]);
    }

    // GET /api/product/search
    public function search()
    {
        $keyword = $this->request->getGet('keyword');
        
        if (!$keyword) {
            return $this->respond([
                'status' => false,
                'message' => 'Keyword is required'
            ], 400);
        }

        $products = $this->model->searchProducts($keyword);

        return $this->respond([
            'status' => true,
            'data' => $products
        ]);
    }
}