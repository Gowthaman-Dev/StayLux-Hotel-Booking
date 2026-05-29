import multer from "multer";
import path from "path";

// 📁 Storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/rooms/"); // folder
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// 🖼️ File filter (only images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png/;

  const isValidExt = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const isValidMime = allowedTypes.test(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb("Only JPG, JPEG, PNG images allowed", false);
  }
};

// 🚀 Upload config
const upload = multer({
  storage,
  fileFilter,
});

export default upload;