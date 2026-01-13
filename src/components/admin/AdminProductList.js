import React, { useEffect, useMemo, useState } from 'react';
import axios from '../../api/axios';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX, HiOutlineExclamationCircle, HiOutlineCube, HiOutlineUpload } from 'react-icons/hi';

const emptyForm = {
    name: '',
    price: '',
    oldPrice: '',
    category: '',
    brand: '',
    countInStock: '',
    image: '',
    description: '',
};

const AdminProductList = () => {
    const [products, setProducts] = useState([]);
    const [formValues, setFormValues] = useState(emptyForm);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');
    const [selectedLibraryImage, setSelectedLibraryImage] = useState('');
    const [localPreview, setLocalPreview] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setError('');
        setLoading(true);
        try {
            const { data } = await axios.get('/products');
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            setError(error?.response?.data?.message || 'Failed to load products');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
        if (name === 'image') {
            setSelectedLibraryImage('');
        }
    };

    const modalTitle = editingProduct ? 'Update Product' : 'Create Product';

    const filteredProducts = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return products;
        return products.filter((p) => {
            const hay = `${p.name || ''} ${p.category || ''} ${p.brand || ''} ${p._id || ''}`.toLowerCase();
            return hay.includes(q);
        });
    }, [products, query]);

    const openCreateForm = () => {
        setEditingProduct(null);
        setFormValues({
            name: '',
            price: '',
            oldPrice: '',
            category: '',
            brand: '',
            countInStock: '',
            image: '',
            description: '',
        });
        setIsModalOpen(true);
        setSelectedLibraryImage('');
        setLocalPreview('');
    };

    const openEditForm = (product) => {
        setEditingProduct(product);
        setFormValues({
            name: product.name || '',
            price: product.price != null ? String(product.price) : '',
            oldPrice: product.oldPrice != null ? String(product.oldPrice) : '',
            category: product.category || '',
            brand: product.brand || '',
            countInStock: product.countInStock != null ? String(product.countInStock) : '',
            image: product.image || '',
            description: product.description || '',
        });
        setIsModalOpen(true);
        setSelectedLibraryImage('');
        setLocalPreview('');
    };

    const closeForm = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setFormValues(emptyForm);
        setSelectedLibraryImage('');
        setLocalPreview('');
    };

    useEffect(() => {
        if (!isModalOpen) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') closeForm();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isModalOpen]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        try {
            const body = {
                name: formValues.name,
                price: Number(formValues.price) || 0,
                oldPrice: Number(formValues.oldPrice) || 0,
                category: formValues.category,
                brand: formValues.brand,
                countInStock: Number(formValues.countInStock) || 0,
                image: formValues.image || selectedLibraryImage || '/images/products/product-1.png',
                description: formValues.description,
            };

            if (editingProduct) {
                await axios.put(`/products/${editingProduct._id}`, body);
            } else {
                await axios.post('/products', body);
            }

            await fetchProducts();
            closeForm();
        } catch (error) {
            setError(error?.response?.data?.message || 'Save failed');
        } finally {
            setSubmitting(false);
        }
    };

    const productLibraryImages = useMemo(
        () => [
            '/images/products/product-1.png',
            '/images/products/product-2.png',
            '/images/products/product-3.png',
            '/images/products/product-4.png',
            '/images/products/product-5.png',
            '/images/products/product-6.png',
            '/images/products/product-7.png',
            '/images/products/product-8.png',
            '/images/products/product-9.png',
            '/images/products/product-10.png',
        ],
        []
    );

    const onSelectLibraryImage = (src) => {
        setSelectedLibraryImage(src);
        setFormValues((prev) => ({ ...prev, image: src }));
        setLocalPreview('');
    };

    const onLocalFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const result = typeof ev.target?.result === 'string' ? ev.target.result : '';
            setLocalPreview(result);
            setSelectedLibraryImage('');
        };
        reader.readAsDataURL(file);
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await axios.delete(`/products/${id}`);
                fetchProducts();
            } catch (error) {
                setError(error?.response?.data?.message || 'Delete failed');
            }
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Products</h2>
                    <p className="text-sm text-gray-600">Create, update, and manage your catalog</p>
                </div>
                <div className="flex gap-3">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full sm:w-64 border rounded-lg px-3 py-2 text-sm bg-white"
                    />
                    <button
                        onClick={openCreateForm}
                        className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                    >
                        <HiOutlinePlus className="text-lg" />
                        Add
                    </button>
                </div>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm flex items-center gap-2">
                    <HiOutlineExclamationCircle className="text-lg" />
                    <span>{error}</span>
                </div>
            )}

            {loading ? (
                <div className="min-h-[200px] flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="rounded-2xl border bg-gray-50 px-6 py-12 text-center">
                    <HiOutlineCube className="text-4xl text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-900 font-semibold">No products found</p>
                    <p className="text-gray-600 text-sm mt-1">Try a different search or add a new product.</p>
                    <button
                        onClick={openCreateForm}
                        className="inline-flex items-center gap-2 mt-5 bg-primary text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                    >
                        <HiOutlinePlus className="text-lg" />
                        Add Product
                    </button>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border bg-white">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">PRODUCT</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">CATEGORY</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">BRAND</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">PRICE</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">STOCK</th>
                                <th className="py-3 px-4 text-right text-xs font-semibold text-gray-600">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product._id} className="border-t">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg border bg-white flex items-center justify-center overflow-hidden">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{product._id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-700">{product.category}</td>
                                    <td className="py-3 px-4 text-sm text-gray-700">{product.brand}</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">${product.price}</td>
                                    <td className="py-3 px-4 text-sm">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${product.countInStock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                            {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openEditForm(product)}
                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 text-sm"
                                            >
                                                <HiOutlinePencil className="text-lg" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteHandler(product._id)}
                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-sm"
                                            >
                                                <HiOutlineTrash className="text-lg" />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={closeForm}
                >
                    <div
                        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl border"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b sticky top-0 bg-white z-10">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{modalTitle}</h3>
                                <p className="text-sm text-gray-600 hidden sm:block">Fill in details and save changes</p>
                            </div>
                            <button onClick={closeForm} className="p-2 rounded-lg hover:bg-gray-100">
                                <HiOutlineX className="text-xl text-gray-700" />
                            </button>
                        </div>

                        <form onSubmit={submitHandler} className="px-4 sm:px-6 py-5">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        value={formValues.name}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <input
                                        name="category"
                                        type="text"
                                        required
                                        value={formValues.category}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Brand</label>
                                    <input
                                        name="brand"
                                        type="text"
                                        value={formValues.brand}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Price</label>
                                    <input
                                        name="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        required
                                        value={formValues.price}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Old Price</label>
                                    <input
                                        name="oldPrice"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formValues.oldPrice}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Count In Stock</label>
                                    <input
                                        name="countInStock"
                                        type="number"
                                        min="0"
                                        required
                                        value={formValues.countInStock}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium mb-2">Product Image</label>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="rounded-xl border bg-gray-50 p-4">
                                            <p className="text-sm font-semibold text-gray-900 mb-2">Choose from library</p>
                                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                                {productLibraryImages.map((src) => (
                                                    <button
                                                        key={src}
                                                        type="button"
                                                        onClick={() => onSelectLibraryImage(src)}
                                                        className={`aspect-square rounded-lg border overflow-hidden bg-white hover:shadow-sm ${selectedLibraryImage === src || formValues.image === src ? 'ring-2 ring-primary' : ''}`}
                                                    >
                                                        <img src={src} alt="Product" className="w-full h-full object-contain" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="rounded-xl border bg-gray-50 p-4">
                                            <p className="text-sm font-semibold text-gray-900 mb-2">Upload new image</p>
                                            <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border bg-white hover:bg-gray-50 cursor-pointer text-sm">
                                                <HiOutlineUpload className="text-lg text-gray-700" />
                                                Choose file
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={onLocalFileChange}
                                                    className="hidden"
                                                />
                                            </label>
                                            <p className="text-xs text-gray-600 mt-2">
                                                Upload shows preview only. To store image on server, add an upload API.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
                                            <input
                                                name="image"
                                                type="text"
                                                value={formValues.image}
                                                onChange={handleChange}
                                                placeholder="/images/products/product-1.png or https://..."
                                                className="w-full border rounded-lg px-3 py-2"
                                            />
                                        </div>
                                        <div className="rounded-xl border bg-white p-3">
                                            <p className="text-xs font-semibold text-gray-600 mb-2">Preview</p>
                                            <div className="w-full h-32 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden border">
                                                <img
                                                    src={localPreview || formValues.image || selectedLibraryImage || '/images/products/product-1.png'}
                                                    alt="Preview"
                                                    className="max-h-28 object-contain"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        required
                                        value={formValues.description}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-3 py-2 h-24"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 order-2 sm:order-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`px-4 py-2 rounded-lg bg-primary text-white hover:bg-gray-800 order-1 sm:order-2 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {editingProduct ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProductList;
