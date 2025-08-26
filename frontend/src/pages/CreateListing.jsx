import React, { useState } from 'react';
import { ArrowLeft, Upload, X, Camera, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import Header from '../components/ui/layout/Header';
import { useToast } from '../hooks/use-toast';

const CreateListing = () => {
  const { toast } = useToast();
  const [images, setImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: '',
    tags: []
  });
  const [currentTag, setCurrentTag] = useState('');

  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion & Style' },
    { value: 'vehicles', label: 'Vehicles' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'books', label: 'Books & Media' },
    { value: 'sports', label: 'Sports & Hobbies' },
    { value: 'collectibles', label: 'Vintage & Collectibles' }
  ];

  const conditions = [
    { value: 'like-new', label: 'Like New' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'vintage', label: 'Vintage' }
  ];

  const handleImageUpload = (files) => {
    const fileArray = Array.from(files);
    const totalImages = images.length + fileArray.length;
    
    if (totalImages > 5) {
      toast({
        title: "Too many images",
        description: "You can upload maximum 5 images per listing.",
        variant: "destructive"
      });
      return;
    }

    fileArray.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages(prev => [...prev, {
            id: Date.now() + Math.random(),
            file,
            preview: e.target.result
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "No Images",
        description: "Please upload at least one image of your item.",
        variant: "destructive"
      });
      return;
    }

    // Mock submission
    console.log('Listing data:', { ...formData, images });
    toast({
      title: "Listing Created!",
      description: "Your thrift item has been listed successfully.",
    });

    // Reset form
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      condition: '',
      location: '',
      tags: []
    });
    setImages([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" className="mb-6 text-gray-600 hover:text-gray-900" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-light text-gray-900">List Your Thrift Item</h1>
          <p className="text-gray-500 mt-2">Give your pre-loved items a new home</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload */}
          <Card className="p-8 border border-gray-200">
            <h2 className="text-xl font-medium mb-2 text-gray-900">Photos</h2>
            <p className="text-gray-500 mb-6">Add up to 5 photos. The first photo will be your cover image.</p>
            
            {/* Image Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
                dragOver 
                  ? 'border-gray-400 bg-gray-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-25'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Add your photos</h3>
              <p className="text-gray-500 mb-6">Drag photos here or click to browse</p>
              
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button type="button" variant="outline" className="cursor-pointer border-gray-300 hover:bg-gray-50">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Photos
                </Button>
              </label>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="mt-8">
                <h3 className="font-medium mb-4 text-gray-900">Photos ({images.length}/5)</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {images.map((image, index) => (
                    <div key={image.id} className="relative aspect-square group">
                      <img
                        src={image.preview}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full p-1.5 hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {index === 0 && (
                        <Badge className="absolute bottom-2 left-2 bg-gray-900">Cover Photo</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Basic Information */}
          <Card className="p-8 border border-gray-200">
            <h2 className="text-xl font-medium mb-6 text-gray-900">Item Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="title" className="text-gray-700">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Vintage Levi's Jeans - Excellent Condition"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="mt-2 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="price" className="text-gray-700">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="mt-2 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-gray-700">Category *</Label>
                <Select onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className="mt-2 border-gray-200 focus:border-gray-400 focus:ring-gray-400">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="condition" className="text-gray-700">Condition</Label>
                <Select onValueChange={(value) => handleInputChange('condition', value)}>
                  <SelectTrigger className="mt-2 border-gray-200 focus:border-gray-400 focus:ring-gray-400">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location" className="text-gray-700">Location</Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="location"
                    placeholder="e.g., Bandra West, Mumbai, Maharashtra"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="pl-10 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="description" className="text-gray-700">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your item's condition, history, and why you're selling it..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="mt-2 min-h-[120px] border-gray-200 focus:border-gray-400 focus:ring-gray-400"
              />
            </div>
          </Card>

          {/* Tags */}
          <Card className="p-8 border border-gray-200">
            <h2 className="text-xl font-medium mb-2 text-gray-900">Tags</h2>
            <p className="text-gray-500 mb-6">Add tags to help buyers discover your item</p>
            
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Add a tag..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="border-gray-200 focus:border-gray-400 focus:ring-gray-400"
              />
              <Button type="button" onClick={addTag} variant="outline" className="border-gray-300 hover:bg-gray-50">
                Add Tag
              </Button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200">
                    {tag}
                    <X 
                      className="w-3 h-3 ml-2" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" className="border-gray-300 hover:bg-gray-50">
              Save as Draft
            </Button>
            <Button type="submit" size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8">
              List Item
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;