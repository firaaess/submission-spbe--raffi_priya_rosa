import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const checkout = async (req, res) => {
  const customerId = req.user.id;

  try {
    const cart = await prisma.cart.findFirst({
      where: { customer_id: customerId, invoice: null },
      include: {
        items: {
          include: {
            book_product: {
              select: { price: true }
            }
          }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty or not found' });
    }

    const totalAmount = cart.items.reduce((total, item) => {
      return total + item.quantity * item.book_product.price;
    }, 0);

    const invoice = await prisma.invoice.create({
      data: {
        total_amount: totalAmount,
        status: 'pending',
        customer_id: customerId,
        cart_id: cart.id
      }
    });

    res.status(201).json({
      invoice_id: invoice.id,
      status: invoice.status,
      total_amount: invoice.total_amount,
      issued_at: invoice.issued_at
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getInvoices = async (req, res) => {
    const customerId = req.user.id;
  
    try {
      const invoices = await prisma.invoice.findMany({
        where: { customer_id: customerId },
        select: {
          id: true,
          cart_id: true,
          total_amount: true,
          status: true,
          issued_at: true,
        },
      });
  
      res.status(200).json(invoices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };