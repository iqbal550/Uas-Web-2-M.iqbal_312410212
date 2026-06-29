<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\CategoryModel;

class Category extends ResourceController
{
    protected $modelName = CategoryModel::class;
    protected $format = 'json';

    public function index()
    {
        $categories = $this->model->findAll();
        
        return $this->respond([
            'status' => true,
            'data' => $categories
        ]);
    }

    public function show($id = null)
    {
        $category = $this->model->find($id);
        
        if (!$category) {
            return $this->respond([
                'status' => false,
                'message' => 'Category not found'
            ], 404);
        }

        return $this->respond([
            'status' => true,
            'data' => $category
        ]);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        
        if (!$data || !isset($data['name'])) {
            return $this->respond([
                'status' => false,
                'message' => 'Category name is required'
            ], 400);
        }

        if ($this->model->where('name', $data['name'])->first()) {
            return $this->respond([
                'status' => false,
                'message' => 'Category name already exists'
            ], 400);
        }

        if (!$this->model->save($data)) {
            return $this->respond([
                'status' => false,
                'message' => 'Failed to create category',
                'errors' => $this->model->errors()
            ], 400);
        }

        $categoryId = $this->model->getInsertID();
        
        return $this->respond([
            'status' => true,
            'message' => 'Category created successfully',
            'data' => $this->model->find($categoryId)
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

        $category = $this->model->find($id);
        
        if (!$category) {
            return $this->respond([
                'status' => false,
                'message' => 'Category not found'
            ], 404);
        }

        if (!$this->model->update($id, $data)) {
            return $this->respond([
                'status' => false,
                'message' => 'Failed to update category',
                'errors' => $this->model->errors()
            ], 400);
        }

        return $this->respond([
            'status' => true,
            'message' => 'Category updated successfully',
            'data' => $this->model->find($id)
        ]);
    }

    public function delete($id = null)
    {
        $category = $this->model->find($id);
        
        if (!$category) {
            return $this->respond([
                'status' => false,
                'message' => 'Category not found'
            ], 404);
        }

        if (!$this->model->delete($id)) {
            return $this->respond([
                'status' => false,
                'message' => 'Failed to delete category'
            ], 400);
        }

        return $this->respond([
            'status' => true,
            'message' => 'Category deleted successfully'
        ]);
    }
}