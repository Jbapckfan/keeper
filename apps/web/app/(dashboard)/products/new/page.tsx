'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@keeper/ui/components/Button';
import { Input } from '@keeper/ui/components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@keeper/ui/components/Card';

const categories = [
  { value: 'ELECTRONICS', label: 'Electronics' },
  { value: 'APPLIANCES', label: 'Appliances' },
  { value: 'FURNITURE', label: 'Furniture' },
  { value: 'AUTOMOTIVE', label: 'Automotive' },
  { value: 'TOOLS', label: 'Tools' },
  { value: 'SPORTING_GOODS', label: 'Sporting Goods' },
  { value: 'JEWELRY', label: 'Jewelry' },
  { value: 'CLOTHING', label: 'Clothing' },
  { value: 'OTHER', label: 'Other' },
];

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    serialNumber: '',
    category: 'ELECTRONICS',
    purchaseDate: '',
    purchasePrice: '',
    purchaseLocation: '',
    warrantyMonths: '12',
    location: '',
    assignedTo: '',
    notes: '',
    tags: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      const payload = {
        ...formData,
        purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined,
        warrantyMonths: formData.warrantyMonths ? parseInt(formData.warrantyMonths, 10) : undefined,
        purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate) : undefined,
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
      };

      console.log('Submitting product:', payload);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to products list
      router.push('/products');
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
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
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="mt-1 text-sm text-gray-500">
            Enter the details of your product to start tracking its warranty
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                Product Name *
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., MacBook Pro 14&quot;"
                required
              />
            </div>

            <div>
              <label htmlFor="brand" className="mb-1 block text-sm font-medium text-gray-700">
                Brand
              </label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g., Apple"
              />
            </div>

            <div>
              <label htmlFor="model" className="mb-1 block text-sm font-medium text-gray-700">
                Model
              </label>
              <Input
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g., M3 Pro"
              />
            </div>

            <div>
              <label htmlFor="serialNumber" className="mb-1 block text-sm font-medium text-gray-700">
                Serial Number
              </label>
              <Input
                id="serialNumber"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                placeholder="e.g., ABC123XYZ"
              />
            </div>

            <div>
              <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Information */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="purchaseDate" className="mb-1 block text-sm font-medium text-gray-700">
                Purchase Date
              </label>
              <Input
                id="purchaseDate"
                name="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="purchasePrice" className="mb-1 block text-sm font-medium text-gray-700">
                Purchase Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="purchasePrice"
                  name="purchasePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="pl-7"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="purchaseLocation"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Purchase Location
              </label>
              <Input
                id="purchaseLocation"
                name="purchaseLocation"
                value={formData.purchaseLocation}
                onChange={handleChange}
                placeholder="e.g., Apple Store, Amazon"
              />
            </div>
          </CardContent>
        </Card>

        {/* Warranty Information */}
        <Card>
          <CardHeader>
            <CardTitle>Warranty Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="warrantyMonths"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Warranty Period (months)
              </label>
              <Input
                id="warrantyMonths"
                name="warrantyMonths"
                type="number"
                min="0"
                value={formData.warrantyMonths}
                onChange={handleChange}
                placeholder="12"
              />
            </div>

            <div className="flex items-end">
              <p className="text-sm text-gray-500">
                {formData.purchaseDate && formData.warrantyMonths && (
                  <>
                    Warranty expires:{' '}
                    <span className="font-medium text-gray-900">
                      {(() => {
                        const date = new Date(formData.purchaseDate);
                        date.setMonth(date.getMonth() + parseInt(formData.warrantyMonths, 10));
                        return date.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        });
                      })()}
                    </span>
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="location" className="mb-1 block text-sm font-medium text-gray-700">
                Current Location
              </label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Home Office, Living Room"
              />
            </div>

            <div>
              <label htmlFor="assignedTo" className="mb-1 block text-sm font-medium text-gray-700">
                Assigned To
              </label>
              <Input
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                placeholder="e.g., John, Family"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="tags" className="mb-1 block text-sm font-medium text-gray-700">
                Tags
              </label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., work, laptop, portable (comma separated)"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Any additional notes about this product..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link href="/products">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Creating...
              </>
            ) : (
              'Create Product'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
