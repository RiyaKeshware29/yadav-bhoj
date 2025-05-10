import { useState, useEffect } from 'react';
import Logo from '../../component/Logo';
import { useUser } from "../../context/UserContext";
import { useLocation, useNavigate } from 'react-router-dom';
import Button from "../../component/CustomButton";
import FooterMenu from '../../component/FooterMenu';
import { toast } from "react-toastify";

const Cart = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const [loading, setLoading] = useState(false); // loader state

  const initialItems = location.state?.items || [];

  const [cartItems, setCartItems] = useState(() => {
    const source = user.selectedItems?.length ? user.selectedItems : initialItems;
    return source.map(item => ({
      ...item,
      quantity: item.quantity || 1,
    }));
  });


  useEffect(() => {
    if (user.selectedItems?.length) {
      setCartItems(
        user.selectedItems.map(item => ({
          ...item,
          quantity: item.quantity || 1,
        }))
      );
    }
  }, [user.selectedItems]);

  const updateQuantity = (itemId, delta) => {
    setCartItems(prev => {
      const updated = prev
        .map(item =>
          item.item_id === itemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter(item => item.quantity > 0);

      updateUser({ selectedItems: updated });
      return updated;
    });
  };

  const handleEmptyCart = () => {
    navigate("/u/menu");
  };

  const handleRemove = (itemId) => {
    setCartItems(prev => {
      const updated = prev.filter(item => item.item_id !== itemId);
      updateUser({ selectedItems: updated });
      return updated;
    });
  };

  const handleEdit = (item) => {
    updateUser(prev => {
      const filtered = (prev.selectedItems || []).filter(i => i.item_id !== item.item_id);
      const updatedSelectedItems = [...filtered, item];
      return { selectedItems: updatedSelectedItems };
    });

    navigate("/u/menu");
  };

  const handleSendToKitchen = async () => {
    setLoading(true);
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + (item.item_price || 0) * item.quantity,
      0
    );

    console.log(user);
    const formData = new FormData();
    formData.append('uid', user.uid); 
    formData.append('table_no', user.tableNumber); 
    formData.append('total_price', totalAmount.toString());
    formData.append('items', JSON.stringify(cartItems.map(item => ({
      item_id: item.item_id,
      quantity: item.quantity
    }))));
    console.log(formData)
    try {
      const res = await fetch(`${apiUrl}order`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to send order');
      }

      const result = await res.json();
      console.log('Order created:', result);
      updateUser({
        order: cartItems,
        totalPrice: totalAmount,
        selectedItems: [], // ✅ Clear selected items from context
      });
      setLoading(false);
      setCartItems([]); // ✅ Clear local cart state

      // alert("Order sent to kitchen! 🍽️");
      toast.success('Order sent to kitchen successfully!');
      
      navigate('/u/order-history');
    } catch (error) {
      console.error("Error sending order:", error);
      // alert("Failed to send order. Please try again.");
      toast.error('Failed to sent order to kitchen!');
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.item_price || 0) * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <div className="cart-wrapper">
        <div className="search-bar-section">
          <Logo />
          <div className="cart-head">
            <h2>Cart</h2>
            <p className="subheading">Review your order</p>
          </div>
        </div>
        <div className="subheading" style={{marginLeft:'10px'}}>You're seated in : Table No. - {user.tableNumber}</div>
        {cartItems.map((item, index) => (
          <CartItem
            key={item.item_id}
            item={item}
            index={index + 1}
            onUpdateQuantity={updateQuantity}
            onRemove={handleRemove}
            onEdit={handleEdit}
          />
        ))}

        {cartItems.length > 0 ? (
          <div className="summary">
            <div className="summary-row">
              <span>Total amount <small>(incl. taxes)</small></span>
              <span className="amount">Rs. {totalAmount.toLocaleString()}</span>
            </div>
            <div className="item-count">
              {cartItems.length} item{cartItems.length > 1 && 's'}
            </div>
            <Button text={loading ? <div className="loader" /> : "Send to kitchen"} onClick={handleSendToKitchen}></Button>
          </div>
        ) : (
          <>
            <div className="empty-cart">
              <p>Your cart is empty.</p>
              <Button width="50%" onClick={handleEmptyCart} text="Go to menu" />
            </div>
            <FooterMenu />
          </>
        )}
      </div>
      <FooterMenu />
    </div>
  );
};

const CartItem = ({ item, index, onUpdateQuantity, onRemove, onEdit }) => {
  return (
    <div className="cart-item">
      <div className="cart-left">
        <p className="item-index">{index}. {item.item_name || 'Unnamed item'}</p>
        <div className="actions">
          <button className="cart-edit-btn" onClick={() => onEdit(item)}>Edit</button> | 
          <button className="cart-remove-btn" onClick={() => onRemove(item.item_id)}>Remove</button>
        </div>
      </div>
      <div className="cart-right">
        <div className="quantity-control">
          <button onClick={() => onUpdateQuantity(item.item_id, -1)}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => onUpdateQuantity(item.item_id, 1)}>+</button>
        </div>
        <div className="price">
          Rs. {(item.item_price * item.quantity || 0).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default Cart;
