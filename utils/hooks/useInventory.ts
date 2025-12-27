import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

export interface InventoryItem {
  id: string;
  user_id: string;
  name: string;
  sku: string;
  category: string;
  current_stock: number;
  min_stock: number;
  max_stock: number;
  reorder_point: number;
  unit_price: number;
  supplier: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  last_restocked: string | null;
  created_at: string;
  updated_at: string;
}

export interface InventoryOrder {
  id: string;
  user_id: string;
  item_id: string | null;
  item_name: string;
  quantity: number;
  supplier: string;
  order_date: string;
  expected_delivery: string | null;
  actual_delivery: string | null;
  status: 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled';
  total_cost: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateInventoryItemInput {
  name: string;
  sku: string;
  category: string;
  current_stock: number;
  min_stock: number;
  max_stock: number;
  reorder_point: number;
  unit_price: number;
  supplier: string;
}

export interface UpdateInventoryItemInput extends Partial<CreateInventoryItemInput> {
  id: string;
}

export interface CreateOrderInput {
  item_id?: string;
  item_name: string;
  quantity: number;
  supplier: string;
  expected_delivery?: string;
  total_cost: number;
  notes?: string;
}

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [orders, setOrders] = useState<InventoryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Fetch inventory items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching inventory items:', err);
      setError(err.message);
      toast.error('Failed to load inventory items');
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_orders')
        .select('*')
        .order('order_date', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      toast.error('Failed to load orders');
    }
  };

  // Add new inventory item
  const addItem = async (input: CreateInventoryItemInput) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('inventory_items')
        .insert({
          ...input,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setItems(prev => [data, ...prev]);
      toast.success('Item added successfully');
      return data;
    } catch (err: any) {
      console.error('Error adding item:', err);
      toast.error(err.message || 'Failed to add item');
      throw err;
    }
  };

  // Update inventory item
  const updateItem = async (input: UpdateInventoryItemInput) => {
    try {
      const { id, ...updates } = input;
      
      const { data, error } = await supabase
        .from('inventory_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setItems(prev => prev.map(item => item.id === id ? data : item));
      toast.success('Item updated successfully');
      return data;
    } catch (err: any) {
      console.error('Error updating item:', err);
      toast.error(err.message || 'Failed to update item');
      throw err;
    }
  };

  // Delete inventory item
  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== id));
      toast.success('Item deleted successfully');
    } catch (err: any) {
      console.error('Error deleting item:', err);
      toast.error(err.message || 'Failed to delete item');
      throw err;
    }
  };

  // Update stock level
  const updateStock = async (id: string, newStock: number) => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .update({ current_stock: newStock })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setItems(prev => prev.map(item => item.id === id ? data : item));
      return data;
    } catch (err: any) {
      console.error('Error updating stock:', err);
      toast.error(err.message || 'Failed to update stock');
      throw err;
    }
  };

  // Create reorder
  const createOrder = async (input: CreateOrderInput) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('inventory_orders')
        .insert({
          ...input,
          user_id: user.id,
          status: 'Processing',
        })
        .select()
        .single();

      if (error) throw error;

      setOrders(prev => [data, ...prev]);
      toast.success('Order created successfully');
      return data;
    } catch (err: any) {
      console.error('Error creating order:', err);
      toast.error(err.message || 'Failed to create order');
      throw err;
    }
  };

  // Update order status
  const updateOrderStatus = async (id: string, status: InventoryOrder['status'], actualDelivery?: string) => {
    try {
      const updates: any = { status };
      if (actualDelivery) {
        updates.actual_delivery = actualDelivery;
      }

      const { data, error } = await supabase
        .from('inventory_orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setOrders(prev => prev.map(order => order.id === id ? data : order));
      toast.success('Order status updated');
      return data;
    } catch (err: any) {
      console.error('Error updating order:', err);
      toast.error(err.message || 'Failed to update order');
      throw err;
    }
  };

  // Receive order (increase stock and mark delivered)
  const receiveOrder = async (orderId: string, itemId: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) throw new Error('Order not found');

      // Update order status
      await updateOrderStatus(orderId, 'Delivered', new Date().toISOString());

      // Update item stock
      const item = items.find(i => i.id === itemId);
      if (item) {
        await updateStock(itemId, item.current_stock + order.quantity);
        
        // Update last_restocked
        await supabase
          .from('inventory_items')
          .update({ last_restocked: new Date().toISOString() })
          .eq('id', itemId);
      }

      toast.success('Order received and stock updated');
    } catch (err: any) {
      console.error('Error receiving order:', err);
      toast.error(err.message || 'Failed to receive order');
      throw err;
    }
  };

  // Get items needing reorder
  const getItemsNeedingReorder = () => {
    return items.filter(item => item.current_stock <= item.reorder_point);
  };

  // Get analytics
  const getAnalytics = () => {
    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + (item.current_stock * item.unit_price), 0);
    const lowStockCount = items.filter(item => item.status === 'Low Stock').length;
    const outOfStockCount = items.filter(item => item.status === 'Out of Stock').length;
    const avgStockLevel = totalItems > 0 
      ? items.reduce((sum, item) => sum + (item.current_stock / item.max_stock * 100), 0) / totalItems 
      : 0;

    return {
      totalItems,
      totalValue,
      lowStockCount,
      outOfStockCount,
      avgStockLevel: avgStockLevel.toFixed(1),
      itemsNeedingReorder: getItemsNeedingReorder().length,
    };
  };

  // Subscribe to real-time changes
  useEffect(() => {
    fetchItems();
    fetchOrders();

    // Set up real-time subscription for items
    const itemsSubscription = supabase
      .channel('inventory_items_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'inventory_items' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setItems(prev => [payload.new as InventoryItem, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setItems(prev => prev.map(item => 
              item.id === payload.new.id ? payload.new as InventoryItem : item
            ));
          } else if (payload.eventType === 'DELETE') {
            setItems(prev => prev.filter(item => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // Set up real-time subscription for orders
    const ordersSubscription = supabase
      .channel('inventory_orders_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'inventory_orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders(prev => [payload.new as InventoryOrder, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev => prev.map(order => 
              order.id === payload.new.id ? payload.new as InventoryOrder : order
            ));
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(order => order.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      itemsSubscription.unsubscribe();
      ordersSubscription.unsubscribe();
    };
  }, []);

  return {
    items,
    orders,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    updateStock,
    createOrder,
    updateOrderStatus,
    receiveOrder,
    getItemsNeedingReorder,
    getAnalytics,
    refresh: fetchItems,
  };
}
