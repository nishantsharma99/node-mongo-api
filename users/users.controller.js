const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploaded');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({storage: storage});

// routes
router.get('/', getAll);
router.patch('/:id', update);
router.post('/register', register);
router.post('/login', authenticate);
router.post('/upload',upload.single('productImage'), (req, res, next)=>{
    userService.upload1(req)
        .then(() => res.json({}))
        .catch(err => next(err));
 
});
router.post('/forgot', forgot);
router.patch('/update/:username', update2);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function update2(req, res, next) {
    userService.update2(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function forgot(req, res, next) {
      console.log("user forgot the password");
}
    