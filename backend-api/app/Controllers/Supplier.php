<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\SupplierModel;

class Supplier extends ResourceController
{
    protected $modelName = SupplierModel::class;
    protected $format = 'json';

    public function index()
    {
        $suppliers = $this->model->findAll();
        
        return $this->respond([
            'status' => true,
            'data' => $suppliers
        ]);
    }

    public function show($id = null)
    {
        $supplier = $this->model->find($id);
        
        if (!$supplier) {
            return $this->respond([
                'status' => false,
                'message' => 'Supplier not found'
            ], 404);
        }

        return $this->respond([
            'status' => true,
            'data' => $supplier
        ]);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        
        if (!$data || !isset($data['name'])) {
            return $this->respond([
                'status' => false,
                'message' => 'Supplier name is required'
            ], 400);
        }

        if (!$this->model->save($data)) {
            return $this->respond([
                'status' => false,
                'message' => 'Failed to create supplier',
                'errors' => $this->model->errors()
            ], 400);
        }

        $supplierId = $this->model->getInsertID();
        
        return $this->respond([
            'status' => true,
            'message' => 'Supplier created successfully',
            'data' => $this->model->find($supplierId)
        ], 201);
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        
        if (!$data) {
            return $this->respond([
                'status' => false,
                'message' => 'Invalid data'
            ], 400);
        }

        $supplier = $this->model->find($id);
        
        if (!$supplier) {
            return $this->respond([
                'status' => false,
                'message' => 'Supplier not found'
            ], 404);
        }

        if (!$this->model->update($id, $data)) {
            return $this->respond([
                'status' => false,
                'message' => 'Failed to update supplier',
                'errors' => $this->model->errors()
            ], 400);
        }

        return $this->respond([
            'status' => true,
            'message' => 'Supplier updated successfully',
            'data' => $this->model->find($id)
        ]);
    }

    public function delete($id = null)
    {
        $supplier = $this->model->find($id);
        
        if (!$supplier) {
            return $this->respond([
                'status' => false,
                'message' => 'Supplier not found'
            ], 404);
        }

        if (!$this->model->delete($id)) {
            return $this->respond([
                'status' => false,
                'message' => 'Failed to delete supplier'
            ], 400);
        }

        return $this->respond([
            'status' => true,
            'message' => 'Supplier deleted successfully'
        ]);
    }
}