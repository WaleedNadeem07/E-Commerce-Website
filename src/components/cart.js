import React, { useEffect, useContext }  from 'react';
import { connect } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { FaShoppingCart } from 'react-icons/fa'; // Import the cart icon
import UserContext from '../userContext';
import './Home.css';

function Cart({ cartItems, removeFromCart, incrementQuantity, decrementQuantity }) {
    console.log("HERE");
    console.log(cartItems);

    const { username } = useContext(UserContext);
    const navigate = useNavigate();
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cartItems.reduce((total, product) => total + product.price * product.quantity, 0);

    // Calculate the Tax (5% of the price of each product)
    const taxRate = 0.05;
    const tax = cartItems.reduce((totalTax, product) => totalTax + product.price * product.quantity * taxRate, 0);
    const total = subtotal + tax;

    useEffect(() => {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    console.log("HERE");
    console.log("subtotal:", subtotal);
    console.log("tax:", tax);
    console.log("total:", total);

    const handleDelete = (productId) => {
      removeFromCart(productId);
    };

    const handleIncrement = (productId) => {
      // Implement logic to increment the quantity of the product with the given productId
      // Dispatch an action to update the quantity in the store
      incrementQuantity(productId);
    };
  
    const handleDecrement = (productId) => {
      // Implement logic to decrement the quantity of the product with the given productId
      // Dispatch an action to update the quantity in the store
      
      decrementQuantity(productId);
    };

    const handleLogout = () => {
      // Redirect to the "/login" page
      navigate('/');
    };

    const handlePlaceOrder = () => {
      // Create the order data to send to the backend
      const quantitiesArray = cartItems.map((product) => product.quantity);
      const pricesArray = cartItems.map((product) => product.price);
      console.log(quantitiesArray, pricesArray);
      const orderData = {
        date: new Date().toISOString(),
        orderNumber: Math.floor(Math.random() * 1000), // Assigning a random order number (you can use a more sophisticated approach here)
        numberOfProducts: cartItems.length,
        price: total.toFixed(2),
        products: cartItems.map((product) => product.title),
        userid: username, // Add the userid or username to the order data
        quantities: quantitiesArray, // Add the quantities array to the order data
        prices: pricesArray, // Add the prices array to the order data
      };
  
      // Make an API call to the backend to save the order data
      axios.post('http://localhost:8000/cart/save-order', orderData)
        .then((response) => {
          // Handle success response, e.g., show a success message
          console.log('Order placed successfully:', response.data);
          alert("Order Placed Successfully!");
          // Optionally, you can clear the cart after placing the order
          // dispatch({ type: 'CLEAR_CART' });
        })
        .catch((error) => {
          // Handle error, e.g., show an error message
          if (error.response && error.response.status === 400) {
            console.error('Error placing order:', error.response.data.message);
            alert(error.response.data.message);
          } else {
            console.error('Error placing order:', error);
          }
        });
    };

  return (
      <div>
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-md">
      <a className="navbar-brand">E-commerce</a>
            <div className="d-flex">
            <Link to="/cart" className="navbar-icon" style={{ position: 'relative' }}>
            <FaShoppingCart className="navbar-icon-item" style={{ marginLeft: '-2rem', marginTop: '0.6rem' }} />
            {cartCount > 0 && (
              <span style={{ marginLeft: '-0.3rem' }} className="badge badge-warning" id="lblCartCount">
                {cartCount}
              </span>
            )}
            </Link>
            <div className="d-flex">
              <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-basic" style={{ cursor: 'pointer', color: 'blue' }}>
                  {username || 'Guest'} 
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/orders">Orders</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            </div>
      </div>
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', marginLeft: '110px' }}>
        <Link to="/home" style={{ marginRight: '10px' }}>&#8592;</Link>
        <h4 style={{ color: 'blue' }}>Your Shopping Bag</h4>
      </div>
      <div class="container">
      <table class="table table-bordered">
  <thead>
    <tr>
      <th scope="col">Product</th>
      <th scope="col">Quantity</th>
      <th scope="col">Price</th>
      <th scope="col">Action</th>
    </tr>
  </thead>
  <tbody>
  {cartItems.map((product) => (
              <tr key={product.id}>
                <td>
                  <img src={`/uploads/${product.image}`} alt={product.title} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                  {product.title}
                </td>
                <td>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button className="btn btn-primary" onClick={() => handleDecrement(product.title)}>
                      -
                    </button>
                    <span style={{ margin: '0 10px' }}>{product.quantity}</span>
                    <button className="btn btn-primary" onClick={() => handleIncrement(product.title)}>
                      +
                    </button>
                  </div>
                </td>
                <td>${product.price}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(product.title)}>
                    <FontAwesomeIcon icon="trash-alt" />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      </div>
      <div className="container mt-4" style={{marginRight: 'auto'}}>
        <div className="row">
          <div className="col-md-8">
            <h5>Subtotal: ${subtotal.toFixed(2)}</h5>
            <h5>Tax: ${tax.toFixed(2)}</h5>
            <h4>Total: ${total.toFixed(2)}</h4>
          </div>
          <div className="col-md-4" style={{marginRight: '3px'}}>
            <button className="btn btn-success" onClick={handlePlaceOrder}>Place Order</button>
          </div>
        </div>
      </div>
      </div>
  );
}

const mapStateToProps = (state) => {
  return {
    cartItems: state.cart.cartItems || [], // Assuming you have named the cart slice as "cart" in the rootReducer
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeFromCart: (productId) => {
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    },
    incrementQuantity: (productId) => {
      dispatch({ type: 'INCREMENT_QUANTITY', payload: productId });
    },
    decrementQuantity: (productId) => {
      dispatch({ type: 'DECREMENT_QUANTITY', payload: productId });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
