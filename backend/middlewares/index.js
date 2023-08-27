import express from 'express';
import cors from 'cors';

const ApplyMiddlewares = (app) => {
  app.use(cors());
  app.use(express.json()); // Middleware for parsing JSON data
  app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded data
};

export default ApplyMiddlewares;
