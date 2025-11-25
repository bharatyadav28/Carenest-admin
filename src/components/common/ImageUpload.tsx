import { useState } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { uploadImage } from '@/lib/image-upload';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({ 
  onImageUpload, 
  currentImage, 
  disabled = false,
  className = "" 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      onImageUpload(imageUrl);
      URL.revokeObjectURL(objectUrl);
      setPreviewUrl(imageUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageUpload('');
  };

  const displayUrl = previewUrl || currentImage;

  return (
    <div className={className}>
      {displayUrl ? (
        <div className="relative inline-block">
          <img
            src={displayUrl}
            alt="Preview"
            className="w-24 h-24 object-cover rounded border"
          />
          {!disabled && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <FiX className="w-3 h-3" />
            </button>
          )}
        </div>
      ) : (
        <div className="relative border-2 border-dashed border-gray-300 rounded p-4 text-center w-24 h-24 flex items-center justify-center">
          {isUploading ? (
            <LoadingSpinner />
          ) : (
            <>
              <FiUpload className="w-5 h-5 text-gray-400" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading || disabled}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}