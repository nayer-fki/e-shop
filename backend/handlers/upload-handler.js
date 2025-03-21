const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Define the upload directory
const uploadDir = path.join(__dirname, '..', 'uploads');

// Ensure the 'uploads' directory exists (async version)
const ensureUploadDirExists = async () => {
  try {
    const dirExists = await fs.promises.stat(uploadDir).catch(() => false);
    if (!dirExists) {
      await fs.promises.mkdir(uploadDir, { recursive: true });
    }
  } catch (err) {
    console.error('Error ensuring upload directory exists:', err.message);
    throw new Error('Failed to ensure upload directory exists');
  }
};

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Set upload directory
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, uniqueName); // Generate unique filename
  },
});

// Multer instance for handling file uploads
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB file size limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
  },
});

// Function to delete the uploaded file
const deleteFile = async (filePath) => {
  try {
    const fileExists = await fs.promises.stat(filePath).catch(() => false);
    if (!fileExists) {
      throw new Error('File not found');
    }

    await fs.promises.unlink(filePath); // Delete the file asynchronously
    console.log(`File deleted: ${filePath}`);
  } catch (err) {
    console.error('Error during file deletion:', err.message);
    throw err; // Rethrow the error for the calling function to handle
  }
};

// Export functions
module.exports = {
  upload,
  deleteFile,
  ensureUploadDirExists,
};
