import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllBooks = async (req, res) => {
  try {
    const books = await prisma.books.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookDetail = async (req, res) => {
    const { id } = req.params;
  
    try {
      const book = await prisma.books.findUnique({
        where: { id },
        include: {
          author: {
            select: { id: true, name: true },
          },
          products: {
            select: {
              id: true,
              format: true,
              price: true,
              stock: true,
              warehouse: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
  
      if (!book) return res.status(404).json({ message: 'Book not found' });
  
      res.json(book);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };