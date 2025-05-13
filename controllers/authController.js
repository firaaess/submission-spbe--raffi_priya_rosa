import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Register Customer
export const registerCustomer = async (req, res) => {
  const { name, email, password, address, phone } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
      // Cek apakah email sudah ada
      const existingCustomer = await prisma.customer.findUnique({
        where: { email },
      });
  
      if (existingCustomer) {
        return res.status(400).json({ message: 'Email sudah digunakan' });
      }
  
    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        phone,
      },
    });

    const token = jwt.sign({ id: customer.id, email: customer.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login Customer
export const loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  const customer = await prisma.customer.findUnique({ where: { email } });

  if (!customer) {
    return res.status(404).json({ message: 'Customer not found' });
  }

  const isMatch = await bcrypt.compare(password, customer.password);

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid password' });
  }

  const token = jwt.sign({ id: customer.id, email: customer.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
};
