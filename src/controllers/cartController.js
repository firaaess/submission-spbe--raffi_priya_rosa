import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const addToCart = async (req, res) => {
  const customerId = req.user.id;
  const { books_product_id, quantity } = req.body;

  try {
    // Cari cart aktif user (yang belum di-checkout)
    let cart = await prisma.cart.findFirst({
      where: { customer_id: customerId, invoice: null },
    });

    // Kalau belum ada, buat cart baru
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          customer_id: customerId,
        },
      });
    }

    // Tambahkan item ke cart
    const item = await prisma.cartItem.create({
      data: {
        cart_id: cart.id,
        books_product_id,
        quantity,
      },
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCart = async (req, res) => {
    const customerId = req.user.id;
  
    try {
      const cart = await prisma.cart.findFirst({
        where: { customer_id: customerId, invoice: null },
        include: {
          items: {
            include: {
              book_product: {
                select: {
                  format: true,
                  price: true,
                  book: {
                    select: {
                      title: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
  
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };