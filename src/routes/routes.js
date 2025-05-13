import express from 'express';
import { registerCustomer, loginCustomer } from '../controllers/authController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';
import { getAllBooks, getBookDetail } from '../controllers/bookController.js';
import { addToCart, getCart } from '../controllers/cartController.js';
import { checkout, getInvoices } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/auth/register', registerCustomer);
router.post('/auth/login', loginCustomer);
router.get('/books', authenticateJWT, getAllBooks)
router.get('/books/:id', authenticateJWT, getBookDetail)
router.post('/cart/item', authenticateJWT, addToCart)
router.get('/cart', authenticateJWT, getCart)
router.post('/checkout', authenticateJWT, checkout)
router.get('/invoice', authenticateJWT, getInvoices)

export default router;
