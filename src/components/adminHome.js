import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../userContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Dropdown, FormControl,Offcanvas, Pagination } from 'react-bootstrap';
import { FaShoppingCart, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import './Home.css';

function AdminHome({ cartItems, addToCart }) {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const { username } = useContext(UserContext); 
    const [cartCount, setCartCount] = useState(0); // State for cart count
    const [selectedLink, setSelectedLink] = useState('products');
    
    const handleLogout = () => {
      // Redirect to the "/login" page
      navigate('/');
    };
  
    useEffect(() => {
      const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
      setCartCount(totalCount);
        fetch('http://localhost:8000/product/get')
            .then(res => res.json(),
            console.log(products))
            .then(json => setProducts(json));
        fetch('http://localhost:8000/product/get-orders') // Assuming this endpoint exists for fetching orders
        .then(res => res.json())
        .then(json => setOrders(json))
        .then(console.log(orders));
    }, [cartItems]);

    const handleDelete = (productId) => {
        console.log("HERE");
    };

    return (
      <div>
        <nav className="navbar navbar-light bg-light">
          <div className="container-fluid">
            <a className="navbar-brand">Welcome, {username || 'Guest'}</a>
            <div className="d-flex">
            <div className="d-flex">
              <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-basic" style={{ cursor: 'pointer', color: 'blue' }}>
                  {username || 'Guest'} 
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            </div>
          </div>
        </nav>
        
        <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
            <div className="position-sticky" style={{ height: '100vh' }}>
              <ul className="nav flex-column">
                <li className={`nav-item ${selectedLink === 'products' ? 'active' : ''}`}>
                    <Link to="#" className="nav-link" onClick={() => setSelectedLink('products')}>
                    {selectedLink === 'products' && <span className="arrow">&#10148;</span>} Products
                    </Link>
                </li>
                <li className={`nav-item ${selectedLink === 'orders' ? 'active' : ''}`}>
                  {/* onClick handler to set the selected link */}
                  <Link to="#" className="nav-link" onClick={() => setSelectedLink('orders')}>
                  {selectedLink === 'orders' && <span className="arrow">&#10148;</span>} Orders
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          {/* Main content */}
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            {selectedLink === 'products' && <ProductsTable products={products} />}
            {selectedLink === 'orders' && <OrdersTable orders={orders} />}
          </main>
        </div>
      </div>
      </div>
    );
  }

  const mapStateToProps = (state) => {
    return {
      cartItems: state.cart.cartItems || [],
    };
  };

  // Map dispatch actions to component props
  const mapDispatchToProps = (dispatch) => {
    return {
      addToCart: (product) => dispatch({ type: 'ADD_TO_CART', payload: product }),
    };
  };
   
// Separate component for Products Table
function ProductsTable({ products }) {
    const [showEditOffcanvas, setShowEditOffcanvas] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 8; // Number of products to display per page

    // ... (Previous code remains unchanged)

    // Calculate the index of the first and last products to display on the current page
    const indexOfLastProduct = currentPage * resultsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - resultsPerPage;

    // Slice the products array to get the products for the current page
    const productsToDisplay = products.slice(indexOfFirstProduct, indexOfLastProduct);

    // Calculate the total number of products and total number of pages
    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / resultsPerPage);

    // Function to handle page change
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
      // You can fetch the data for the new page here, e.g., call an API with the new page number
    };

    const onDeleteProduct = (product) => {
        const productTitle = product.title
        // Make a POST request to the backend API to delete the product
        axios
          .post('http://localhost:8000/product/remove', { title: product.title })
          .then((response) => {
            // Handle the response from the backend if needed
            alert(response.data.message);
            console.log('Product deleted:', response.data);
            window.location.reload();
          });
      };
    const onEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditOffcanvas(true);
    };

    const [showAddNewForm, setShowAddNewForm] = useState(false);
    const [newProduct, setNewProduct] = useState({
      title: '',
      price: '',
      quantity: '',
      category:'',
      description:'',
      image: null,
    });

    return (
      <div>
        <h2 style={{ color:'blue' }}>Products
        <button className="btn btn-primary mb-3" style={{marginLeft:'60rem', marginTop:'0.5em'}} onClick={() => setShowAddNewForm(true)} >Add New</button>
        </h2>
        {/* Table code goes here */}
        <table class="table table-bordered">
          <thead class="table-light">
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
              {/* Add more table headers as needed */}
            </tr>
          </thead>
          <tbody>
            {productsToDisplay.map((product) => (
              <tr key={product.id}>
                <td>
                <img src={`/uploads/${product.image}`} alt={product.title} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                    {product.title}
                    {console.log(product.image)}
                </td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>
                    <button className="btn btn-danger" onClick={() => onDeleteProduct(product)}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                    <span style={{ margin: '0 6px' }}></span>
                    <button className="btn btn-primary ml-2" title="Edit" onClick={() => onEditProduct(product)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                </td>
                {/* Add more table data as needed */}
              </tr>
            ))}
          </tbody>
        </table>
        <Offcanvas show={showEditOffcanvas} onHide={() => setShowEditOffcanvas(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Edit Product</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Display the form to edit the product here */}
          {selectedProduct && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <img src={`/uploads/${selectedProduct.image}`} alt={selectedProduct.title} style={{ width: '100px', height: '100px', marginRight: '10px' }} />
                <label htmlFor="uploadImage" style={{ cursor: 'pointer', color: 'blue' }}>
                  <FontAwesomeIcon icon={faEdit} /> Upload New Picture
                </label>
                <input
                  type="file"
                  id="uploadImage"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    setSelectedProduct({ ...selectedProduct, image: e.target.files[0] });
                    //console.log(selectedProduct.image);
                    //alert("Image Uploaded Successfully! Click Update Product to save changes");
                  }}
                />
              </div>
              <h5>Product Name</h5>
              <input
                type="text"
                placeholder={selectedProduct.title}
                value={selectedProduct.title}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, title: e.target.value })}
              />
              <h5>Price</h5>
              <input
                type="text"
                placeholder={selectedProduct.price}
                value={selectedProduct.price}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
              />
              <h5>Quantity</h5>
              <input
                type="text"
                placeholder={selectedProduct.quantity}
                value={selectedProduct.quantity}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, quantity: e.target.value })}
              />
              {/* ... Additional fields for editing the product ... */}
              <p></p>
              {/* Add a separate button to initiate the update */}
              <button
                className="btn btn-success"
                onClick={async () => {
                  try {
                    // Create a new FormData object to send the form data to the server efficiently
                    const formData = new FormData();
                    formData.append('_id', selectedProduct._id); // Make sure to include the product ID in the form data
                    formData.append('title', selectedProduct.title);
                    formData.append('price', selectedProduct.price);
                    formData.append('quantity', selectedProduct.quantity);
                    // Append the product image to the form data (if it's not a URL)
                    formData.append('image', selectedProduct.image);

                    // Make a POST request to update the product using axios with the form data
                    const response = await axios.post('http://localhost:8000/product/update', formData, {
                      headers: {
                        'Content-Type': 'multipart/form-data' // Set the content type to handle form data correctly
                      }
                    });
                    console.log('Product updated:', response.data);

                    setShowEditOffcanvas(false); // Close the off-canvas after updating
                  } catch (error) {
                    alert(error);
                    console.error('Error updating product:', error);
                    // Handle error if needed
                  }
                }}
              >
                Update Product
              </button>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      <Offcanvas show={showAddNewForm} onHide={() => setShowAddNewForm(false)} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Add New Product</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {/* Display the form to add a new product here */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            {/* Display the image preview here */}
            <img
              src={newProduct.image ? URL.createObjectURL(newProduct.image) : ''}
              alt="Product Preview"
              style={{ width: '100px', height: '100px', marginRight: '10px' }}
            />
            <label htmlFor="uploadImage" style={{ cursor: 'pointer', color: 'blue' }}>
              <FontAwesomeIcon icon={faEdit} /> Upload New Picture
            </label>
            <input
              type="file"
              id="uploadImage"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                setNewProduct({ ...newProduct, image: e.target.files[0] }); 
              }}
            />
          </div>
          <h5>Product Name</h5>
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.title}
            onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
          />
          <h5>Price</h5>
          <input
            type="text"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <h5>Quantity</h5>
          <input
            type="text"
            placeholder="Quantity"
            value={newProduct.quantity}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
          />
          <h5>Category</h5> {/* Add the category input field */}
          <input
            type="text"
            placeholder="Category"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          />
          <h5>Description</h5>
          <input
            type="text"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          {/* ... Additional fields for adding the new product ... */}
          <p></p>
          {/* Add a separate button to initiate the product creation */}
          <button
            className="btn btn-success"
            onClick={async () => {
              try {
                // Create a new FormData object to send the form data to the server efficiently
                const formData = new FormData();
                formData.append('title', newProduct.title);
                formData.append('price', newProduct.price);
                formData.append('quantity', newProduct.quantity);
                formData.append('image', newProduct.image);
                formData.append('category', newProduct.category);
                formData.append('description', newProduct.description);
                // Make a POST request to add the new product using axios with the form data
                const response = await axios.post('http://localhost:8000/product/create', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data', // Set the content type to handle form data correctly
                  },
                });
                console.log('New product added:', response.data);

                // After adding the new product, close the Offcanvas and reset the newProduct state
                setShowAddNewForm(false);
                setNewProduct({
                  title: '',
                  price: '',
                  quantity: '',
                  category: '',
                  description: '',
                  image: null,
                });
              } catch (error) {
                alert(error);
                console.error('Error adding new product:', error);
                // Handle error if needed
              }
            }}
          >
            Add Product
          </button>
        </div>
        </Offcanvas.Body>
      </Offcanvas>

      <div className="d-flex justify-content-end mt-4">
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
  
  // Separate component for Orders Table
  function OrdersTable({orders}) {

    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 10; // Number of orders to display per page
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    // Calculate total units sold
    const totalUnits = orders.reduce((total, order) => total + order.numberOfProducts, 0);
    // Calculate total amount
    const totalAmount = orders.reduce((total, order) => total + order.price, 0);

    const indexOfLastOrder = currentPage * resultsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - resultsPerPage;
    const filteredOrders = orders.filter((order) =>
        order.userid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(order.orderNumber).includes(searchQuery)
    ).slice(indexOfFirstOrder, indexOfLastOrder);

    const totalOrders = orders.length;
  const totalPages = Math.ceil(totalOrders / resultsPerPage);

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
    return (
      <div>
        <div className="d-flex flex-row">
        <div className="card mr-3" style={{width: '18rem'}}>
          <div className="card-body">
          <h6 class="card-subtitle mb-2 text-body-secondary">Total Orders</h6>
            <p className="card-text" style={{fontSize: '24px', color: 'blue'}}>{orders.length}</p>
          </div>
        </div>
        <span style={{marginLeft: '1rem'}}></span>
        <div className="card" style={{width: '18rem'}}>
          <div className="card-body">
            <h6 class="card-subtitle mb-2 text-body-secondary">Total Units</h6>
            <p className="card-text" style={{fontSize: '24px', color: 'blue'}}>{totalUnits}</p>
          </div>
        </div>
        <span style={{marginLeft: '1rem'}}></span>
        <div className="card" style={{width: '18rem'}}>
          <div className="card-body">
          <h6 class="card-subtitle mb-2 text-body-secondary">Total Amount</h6>
            <p className="card-text" style={{fontSize: '24px', color: 'blue'}}>${totalAmount}</p>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
      <h2 style={{ color: 'blue', marginRight: '45rem' }}>Orders</h2>
      <input
          type="text"
          placeholder="Search by user & order id"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ height: '30px', padding: '0 10px', borderRadius: '5px', border: '1px solid #ccc', width: '25rem' }}
        />
        </div>

        <table class="table table-bordered">
          <thead class="table-light">
            <tr>
              <th>Date</th>
              <th>Order #</th>
              <th>User</th>
              <th>Product(s)</th>
              <th>Amount</th>
              <th>Action</th>
              {/* Add more table headers as needed */}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>
                    {formatDate(order.date)}
                </td>
                <td>{order.orderNumber}</td>
                <td>{order.userid}</td>
                <td>{order.numberOfProducts}</td>
                <td>{order.price}</td>
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
                {/* Add more table data as needed */}
              </tr>
            ))}
          </tbody>
        </table>
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
              <p>User: {selectedOrder.userid}</p>
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
        {/* Table code goes here */}
        <div style={{marginRight: '7rem'}} className="d-flex justify-content-end mt-4">
        <p style={{ color: 'gray', marginRight: '57rem'}}>
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

  function formatDate(dateString) {
    const dateObj = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return dateObj.toLocaleDateString(undefined, options);
  }

  export default connect(mapStateToProps, mapDispatchToProps)(AdminHome);