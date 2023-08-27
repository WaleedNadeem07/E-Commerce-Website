import React, { useEffect, useContext, useState }  from 'react';
import { connect } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Offcanvas, Dropdown, Pagination} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { FaShoppingCart } from 'react-icons/fa'; // Import the cart icon
import UserContext from '../userContext';
import './Home.css';

function Orders({cartItems}) {

    const { username } = useContext(UserContext);
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null); // Initially, no order is selected

    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 8; // Number of orders to display per page

    // Calculate the total number of pages based on the total number of orders and resultsPerPage
    const totalOrders = orders.length;
    const totalPages = Math.ceil(totalOrders / resultsPerPage);


    // Filter orders to display only the ones for the current page
    const indexOfLastOrder = currentPage * resultsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - resultsPerPage;
    const ordersToDisplay = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    // Function to handle page change
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
      // You can fetch the data for the new page here, e.g., call an API with the new page number
    };

    // Function to handle off-canvas show and order selection
    const handleShowOffcanvas = (order) => {
      setSelectedOrder(order); // Set the selected order data
      setShowOffcanvas(true); // Show the off-canvas
    };

    const handleCloseOffcanvas = () => {
      setSelectedOrder(null); // Reset the selected order when off-canvas is closed
      setShowOffcanvas(false);
    };
    
    const handleLogout = () => {
      // Redirect to the "/login" page
      navigate('/');
    };

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      }, [cartItems]);

      useEffect(() => {
        const fetchData = async () => {
          try {
            // Make an API call to fetch orders associated with the username
            const ordersResponse = await axios.post('http://localhost:8000/cart/get-orders', { username });
            // Handle the fetched orders
            console.log('Fetched orders:', ordersResponse.data);
            setOrders(ordersResponse.data);
            // You can do further processing with the fetched orders if needed
          } catch (error) {
            // Handle error while fetching orders
            console.error('Error fetching orders:', error);
          }
        };
    
        fetchData();
      }, [username]); 

    return(
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
        <Link to="/cart" style={{ marginRight: '10px' }}>&#8592;</Link>
        <h4 style={{ color: 'blue' }}>Orders</h4>
      </div>
      <div class="container">
      <table class="table table-bordered">
  <thead>
    <tr>
      <th scope="col">Date</th>
      <th scope="col">Order #</th>
      <th scope="col">Products</th>
      <th scope="col">Amount</th>
      <th scope="col">Action</th>
    </tr>
  </thead>
    <tbody>
            {ordersToDisplay.map((order) => (
              <tr key={order._id}>
                <td>{formatDate(order.date)}</td>
                <td>{order.orderNumber}</td>
                <td>{order.products.length}</td>
                <td>${order.price}</td>
                <td>
                  <button
                    onClick={() => {
                      // Handle button click action here
                      // You can use history.push or any other method to navigate to the order details page
                      handleShowOffcanvas(order);
                    }}
                    style={{ textDecoration: 'none', border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    &#8599;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
      </table>
      </div>
      <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title style={{ color: 'blue', textDecoration: 'underline' }}>Order Details</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Display order details here */}
          {selectedOrder && (
            <div>
              <p>Date: {formatDate(selectedOrder.date)}</p>
              <p>Order #: {selectedOrder.orderNumber}</p>
              <p>User: {username}</p>
              <p>Number of Products: {selectedOrder.products.length}</p>
              <p>Amount: ${selectedOrder.price}</p>
              <hr />
              <h6>Product Information</h6>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                {selectedOrder.products.map((product, index) => (
                    <tr key={index}>
                      <td>{product}</td>
                      <td>${selectedOrder.prices[index]}</td>
                      <td>{selectedOrder.quantities[index]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* ... Other order details ... */}
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
      <div style={{marginRight: '7rem'}} className="d-flex justify-content-end mt-4">
        <p style={{ color: 'gray', marginRight: '68rem'}}>
          {totalOrders} Total Count
        </p>
        <Pagination>
          {/* Create pagination items */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Pagination.Item
              key={page}
              active={page === currentPage}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Pagination.Item>
          ))}
        </Pagination>
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

function formatDate(dateString) {
    const dateObj = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return dateObj.toLocaleDateString(undefined, options);
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(Orders);