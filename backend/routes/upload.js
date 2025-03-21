const express = require('express');
const { upload, deleteFile } = require('../handlers/upload-handler');
const path = require('path');  // Add this line to fix the path issue
const router = express.Router();

// POST route: Upload a file
router.post('/', upload.single('image'), (req, res) => {
  try {
    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ message: 'File uploaded successfully', imageUrl });
  } catch (err) {
    console.error(`Upload error: ${err.message}`);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

// DELETE route: Delete a file
router.delete('/uploads/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '..', 'uploads', filename);

  try {
    deleteFile(filePath); // This function handles the deletion
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error(`Delete error: ${err.message}`);
    res.status(500).json({ message: 'Deletion failed', error: err.message });
  }
});



module.exports = router;
