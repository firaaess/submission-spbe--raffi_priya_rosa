import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1. Seed Authors
  const author = await prisma.authors.create({
    data: {
      name: 'Robert C. Martin',
      bio: 'Author of Clean Code',
      birthdate: new Date('1952-12-05'),
    },
  });

  // 2. Seed Books
  const book = await prisma.books.create({
    data: {
      title: 'Clean Code',
      isbn: '9780132350884',
      publication_year: 2008,
      genre: 'Programming',
      author_id: author.id,
    },
  });

  // 3. Seed Warehouse
  const warehouse = await prisma.warehouse.create({
    data: {
      name: 'Gudang Jakarta',
      location: 'Jakarta',
      capacity: 1000,
    },
  });

  // 4. Seed BooksProduct
  await prisma.booksProduct.createMany({
    data: [
      {
        book_id: book.id,
        price: 350000,
        stock: 12,
        format: 'hardcover',
        warehouse_id: warehouse.id,
      },
      {
        book_id: book.id,
        price: 250000,
        stock: 5,
        format: 'paperback',
        warehouse_id: warehouse.id,
      },
    ],
  });
}

main()
  .then(() => {
    console.log('✅ Seeding selesai!');
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
