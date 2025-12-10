'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@keeper/ui/components/Button';
import { Badge } from '@keeper/ui/components/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@keeper/ui/components/Card';

// Mock data - replace with API call
const mockProduct = {
  id: '1',
  name: 'MacBook Pro 14"',
  brand: 'Apple',
  model: 'M3 Pro',
  serialNumber: 'C02XL1YJFVH',
  category: 'ELECTRONICS',
  purchaseDate: '2024-01-15',
  purchasePrice: 1999,
  purchaseLocation: 'Apple Store',
  warrantyMonths: 12,
  warrantyExpires: '2025-01-15',
  warrantyStatus: 'ACTIVE',
  healthScore: 95,
  location: 'Home Office',
  assignedTo: 'John',
  notes: 'Primary work laptop. AppleCare+ extended warranty purchased separately.',
  tags: ['work', 'laptop', 'portable'],
  imageUrl: null,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-02-01T14:22:00Z',
  receipt: {
    id: 'r1',
    merchantName: 'Apple Store',
    purchaseDate: '2024-01-15',
  },
  manual: {
    id: 'm1',
    brand: 'Apple',
    model: 'MacBook Pro',
    pdfUrl: '/manuals/macbook-pro-user-guide.pdf',
  },
  maintenanceLogs: [
    {
      id: 'ml1',
      type: 'CLEANING',
      description: 'Cleaned keyboard and screen',
      performedAt: '2024-02-15',
      cost: 0,
    },
    {
      id: 'ml2',
      type: 'SOFTWARE_UPDATE',
      description: 'Updated to macOS Sonoma 14.3',
      performedAt: '2024-02-01',
      cost: 0,
    },
  ],
  smartActions: [
    {
      id: 'sa1',
      type: 'WARRANTY_REMINDER',
      title: 'Warranty expires in 11 months',
      description: 'Consider extended warranty options before expiration',
      priority: 2,
      status: 'PENDING',
    },
  ],
};

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
    month: 'long',
    day: 'numeric',
  });
}

function getDaysUntilExpiry(dateString: string) {
  const expiryDate = new Date(dateString);
  const today = new Date();
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export default function ProductDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'maintenance' | 'documents'>('overview');

  // TODO: Fetch product data based on params.id
  const product = mockProduct;
  const daysUntilExpiry = getDaysUntilExpiry(product.warrantyExpires);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/products"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <Badge variant={getWarrantyBadgeVariant(product.warrantyStatus)}>
                {product.warrantyStatus}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {product.brand} {product.model} • {product.serialNumber}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Edit
          </Button>
          <Button variant="destructive">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Purchase Price</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">
              {formatCurrency(product.purchasePrice)}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Purchased {formatDate(product.purchaseDate)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Warranty</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">
              {daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : 'Expired'}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {daysUntilExpiry > 0 ? 'Until expiration' : formatDate(product.warrantyExpires)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Health Score</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{product.healthScore}%</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
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
            <div className="mt-1 text-xs text-gray-500">Excellent condition</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Location</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">{product.location || '-'}</div>
            <div className="mt-1 text-xs text-gray-500">
              {product.assignedTo ? `Assigned to ${product.assignedTo}` : 'Not assigned'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          {(['overview', 'maintenance', 'documents'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-1 pb-3 text-sm font-medium capitalize ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Product Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-gray-500">Brand</dt>
                  <dd className="mt-1 font-medium text-gray-900">{product.brand}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Model</dt>
                  <dd className="mt-1 font-medium text-gray-900">{product.model}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Serial Number</dt>
                  <dd className="mt-1 font-mono text-sm font-medium text-gray-900">
                    {product.serialNumber}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Category</dt>
                  <dd className="mt-1 font-medium text-gray-900">{product.category}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Purchase Location</dt>
                  <dd className="mt-1 font-medium text-gray-900">{product.purchaseLocation}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Warranty Period</dt>
                  <dd className="mt-1 font-medium text-gray-900">{product.warrantyMonths} months</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm text-gray-500">Tags</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </dd>
                </div>
                {product.notes && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm text-gray-500">Notes</dt>
                    <dd className="mt-1 text-gray-900">{product.notes}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Smart Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Smart Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {product.smartActions.length > 0 ? (
                  product.smartActions.map((action) => (
                    <div
                      key={action.id}
                      className="rounded-lg border border-amber-200 bg-amber-50 p-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-amber-100 p-1.5">
                          <svg
                            className="h-4 w-4 text-amber-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-amber-800">{action.title}</div>
                          <div className="mt-1 text-sm text-amber-700">{action.description}</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No pending actions</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {product.receipt && (
                  <Link
                    href={`/receipts/${product.receipt.id}`}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50"
                  >
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-gray-900">View Receipt</div>
                      <div className="text-xs text-gray-500">{product.receipt.merchantName}</div>
                    </div>
                  </Link>
                )}
                {product.manual && (
                  <Link
                    href={`/manuals/${product.manual.id}`}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50"
                  >
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-gray-900">View Manual</div>
                      <div className="text-xs text-gray-500">
                        {product.manual.brand} {product.manual.model}
                      </div>
                    </div>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Maintenance History</CardTitle>
            <Button size="sm">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Log Maintenance
            </Button>
          </CardHeader>
          <CardContent>
            {product.maintenanceLogs.length > 0 ? (
              <div className="space-y-4">
                {product.maintenanceLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-0">
                    <div className="rounded-full bg-gray-100 p-2">
                      <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{log.type}</Badge>
                        <span className="text-sm text-gray-500">{formatDate(log.performedAt)}</span>
                      </div>
                      <p className="mt-1 text-gray-900">{log.description}</p>
                      {log.cost > 0 && (
                        <p className="mt-1 text-sm text-gray-500">Cost: {formatCurrency(log.cost)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-gray-500">No maintenance logs yet</p>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'documents' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Documents</CardTitle>
            <Button size="sm">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Upload Document
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.receipt && (
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Receipt</div>
                    <div className="text-sm text-gray-500">{product.receipt.merchantName}</div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              )}
              {product.manual && (
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                  <div className="rounded-lg bg-green-100 p-2">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">User Manual</div>
                    <div className="text-sm text-gray-500">PDF Document</div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              )}
            </div>
            {!product.receipt && !product.manual && (
              <p className="py-8 text-center text-sm text-gray-500">No documents attached</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
