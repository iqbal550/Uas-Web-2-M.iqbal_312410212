<?php

namespace App\Models;

use CodeIgniter\Model;

class ProductModel extends Model
{
    protected $table = 'products';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'code', 'name', 'description', 'category_id', 
        'supplier_id', 'price', 'stock', 'min_stock', 
        'image', 'status'
    ];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';

    public function getProductsWithRelations()
    {
        return $this->select('products.*, categories.name as category_name, suppliers.name as supplier_name')
                    ->join('categories', 'categories.id = products.category_id', 'left')
                    ->join('suppliers', 'suppliers.id = products.supplier_id', 'left')
                    ->findAll();
    }

    public function getProductById($id)
    {
        return $this->select('products.*, categories.name as category_name, suppliers.name as supplier_name')
                    ->join('categories', 'categories.id = products.category_id', 'left')
                    ->join('suppliers', 'suppliers.id = products.supplier_id', 'left')
                    ->where('products.id', $id)
                    ->first();
    }

    public function searchProducts($keyword)
    {
        return $this->like('name', $keyword)
                    ->orLike('code', $keyword)
                    ->orLike('description', $keyword)
                    ->findAll();
    }
}