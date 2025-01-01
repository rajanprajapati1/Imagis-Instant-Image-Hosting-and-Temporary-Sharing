'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'

export default function ImageUpload() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  const uploadImage = new Promise();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    setFile(file)
    setPreview(URL.createObjectURL(file))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false
  })

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setUploadStatus(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const result = await uploadImage(formData)
      if (result.success) {
        setUploadStatus(`File "${result.fileName}" uploaded successfully!`)
      } else {
        setUploadStatus('Upload failed. Please try again.')
      }
    } catch (error) {
      setUploadStatus('An error occurred. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative h-48 w-full">
            <Image
              src={preview}
              alt="Preview"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        ) : isDragActive ? (
          <p className="text-blue-500">Drop the image here ...</p>
        ) : (
          <p>Drag and drop an image here, or click to select a file</p>
        )}
      </div>
      {file && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">{file.name}</p>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      )}
      {uploadStatus && (
        <p className={`mt-4 text-center ${uploadStatus.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
          {uploadStatus}
        </p>
      )}
    </div>
  )
}

