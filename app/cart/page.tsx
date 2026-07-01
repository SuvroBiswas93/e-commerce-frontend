import type { Metadata } from 'next';
import Container from '@/components/layout/Container';
import CartContent from '@/components/cart/CartContent';

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'Review and manage your shopping cart',
};

export default function CartPage() {
  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <CartContent />
    </Container>
  );
}
