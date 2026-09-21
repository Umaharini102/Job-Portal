const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload folders exist
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = path.join(__dirname, '..', 'uploads');

    if (file.fieldname === 'profileImage' || file.fieldname === 'avatar') {
      dest = path.join(dest, 'avatars');
    } else if (file.fieldname === 'companyLogo' || file.fieldname === 'logo') {
      dest = path.join(dest, 'logos');
    } else if (file.fieldname === 'resume') {
      dest = path.join(dest, 'resumes');
    }

    ensureDir(dest);
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const safeBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, '_')
      .slice(0, 30);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${safeBase}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (
    file.fieldname === 'profileImage' ||
    file.fieldname === 'avatar' ||
    file.fieldname === 'companyLogo' ||
    file.fieldname === 'logo'
  ) {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
    if (allowed.includes(ext)) {
      return cb(null, true);
    }
    return cb(new Error('Only image files (.jpg, .jpeg, .png, .webp, .svg) are allowed'), false);
  }

  if (file.fieldname === 'resume') {
    const allowed = ['.pdf', '.doc', '.docx'];
    if (allowed.includes(ext)) {
      return cb(null, true);
    }
    return cb(new Error('Only document files (.pdf, .doc, .docx) are allowed for resumes'), false);
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB maximum
  },
  fileFilter: fileFilter,
});

module.exports = upload;
