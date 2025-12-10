'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@keeper/ui/components/Button';
import { Input } from '@keeper/ui/components/Input';
import { Badge } from '@keeper/ui/components/Badge';
import { Card, CardContent } from '@keeper/ui/components/Card';

// Mock data - replace with API call
const mockProducts = [
  {
    id: '1',
    name: 'MacBook Pro 14"',
    brand: 'Apple',
    model: 'M3 Pro',
    category: 'ELECTRONICS',
    purchaseDate: '2024-01-15',
    purchasePrice: 1999,
    warrantyExpires: '2025-01-15',
    warrantyStatus: 'ACTIVE',
    healthScore: 95,
    imageUrl: null,
  },
  {
    id: '2',
    name: 'Sony WH-1000XM5',
    brand: 'Sony',
    model: 'WH-1000XM5',
    category: 'ELECTRONICS',
    purchaseDate: '2023-11-20',
    purchasePrice: 349,
    warrantyExpires: '2024-11-20',
    warrantyStatus: 'EXPIRING',
    healthScore: 88,
    imageUrl: null,
  },
  {
    id: '3',
    name: 'Dyson V15 Detect',
    brand: 'Dyson',
    model: 'V15 Detect',
    category: 'APPLIANCES',
    purchaseDate: '2023-06-10',
    purchasePrice: 749,
    warrantyExpires: '2025-06-10',
    warrantyStatus: 'ACTIVE',
    healthScore: 92,
    imageUrl: null,
  },
  {
    id: '4',
    name: 'Samsung 65" OLED TV',
    brand: 'Samsung',
    model: 'S95C',
    category: 'ELECTRONICS',
    purchaseDate: '2023-03-01',
    purchasePrice: 2499,
    warrantyExpires: '2024-03-01',
    warrantyStatus: 'EXPIRED',
    healthScore: 78,
    imageUrl: null,
  },
];

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'ELECTRONICS', label: 'Electronics' },
  { value: 'APPLIANCES', label: 'Appliances' },
  { value: 'FURNITURE', label: 'Furniture' },
  { value: 'AUTOMOTIVE', label: 'Automotive' },
  { value: 'TOOLS', label: 'Tools' },
  { value: 'OTHER', label: 'Other' },
];

const warrantyFilters = [
  { value: '', label: 'All Warranties' },
  { value: 'active', label: 'Active' },
  { value: 'expiring', label: 'Expiring Soon' },
  { value: 'expired', label: 'Expired' },
];

function getWarrantyBadgeVariant(status: string) {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'EXPIRING':
      return 'warning';
    case 'EXPIRED':
      return 'error';
    default:
      return 'secondary';
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [warrantyFilter, setWarrantyFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      !search ||
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.brand.toLowerCase().includes(search.toLowerCase()) ||
      product.model.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = !category || product.category === category;

    const matchesWarranty =
      !warrantyFilter ||
      product.warrantyStatus.toLowerCase() === warrantyFilter.toLowerCase();

    return matchesSearch && matchesCategory && matchesWarranty;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your tracked products and warranties
          </p>
        </div>
        <Link href="/products/new">
          <Button>
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <select
            value={warrantyFilter}
            onChange={(e) => setWarrantyFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {warrantyFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
          <div className="flex rounded-lg border border-gray-300">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 ${
                viewMode === 'grid'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 ${
                viewMode === 'list'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500">
        Showing {filteredProducts.length} of {mockProducts.length} products
      </p>

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  {/* Product Image Placeholder */}
                  <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-gray-100">
                    <svg
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">
                          {product.brand} {product.model}
                        </p>
                      </div>
                      <Badge variant={getWarrantyBadgeVariant(product.warrantyStatus)}>
                        {product.warrantyStatus}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Purchase</span>
                      <span className="font-medium">{formatCurrency(product.purchasePrice)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Warranty expires</span>
                      <span className="font-medium">{formatDate(product.warrantyExpires)}</span>
                    </div>

                    {/* Health Score Bar */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Health Score</span>
                        <span className="font-medium">{product.healthScore}%</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full ${
                            product.healthScore >= 80
                              ? 'bg-green-500'
                              : product.healthScore >= 60
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${product.healthScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Purchase
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Warranty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Health
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <Link href={`/products/${product.id}`} className="block">
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">
                        {product.brand} {product.model}
                      </div>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {product.category}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(product.purchasePrice)}
                    </div>
                    <div className="text-sm text-gray-500">{formatDate(product.purchaseDate)}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Badge variant={getWarrantyBadgeVariant(product.warrantyStatus)}>
                      {product.warrantyStatus}
                    </Badge>
                    <div className="mt-1 text-xs text-gray-500">
                      Expires {formatDate(product.warrantyExpires)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <span className="mr-2 text-sm font-medium">{product.healthScore}%</span>
                      <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full ${
                            product.healthScore >= 80
                              ? 'bg-green-500'
                              : product.healthScore >= 60
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${product.healthScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-2 text-sm text-gray-500">
            {search || category || warrantyFilter
              ? 'Try adjusting your filters'
              : 'Get started by adding your first product'}
          </p>
          {!search && !category && !warrantyFilter && (
            <Link href="/products/new">
              <Button className="mt-4">Add Product</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
