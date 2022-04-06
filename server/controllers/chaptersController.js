const AppError = require('../utils/AppError');
const express = require('express');
const db = require ('../models.js');
require('dotenv').config();
const getGeocodeFromAddress = require('../utils/geocode');

const chaptersController = {};

chaptersController.getAllChapters = async (req, res, next) => {
  try {
    // eslint-disable-next-line semi
    const text = 'SELECT * FROM public.chapters ORDER BY name ASC'
    await db.query(text, (err, result) => {
      if (!result.rows[0]) return res.send('Error: There are no chapters in the database');
      if (result) return res.send(result.rows);
      if (err) return res.send('error getting records from database');
    });
  } catch (err) {
    return next(new AppError(new Error('Not implemented'), 'chaptersController', 'getAllChapters', 500));
  }
};

chaptersController.getChapter = async (req, res, next) => {
  const {
    chapterId
  } = req.params;

  try {
    // eslint-disable-next-line semi
    const text = 'SELECT * FROM public.chapters WHERE id = $1'
    const values = [chapterId];
    await db.query(text, values, (err, result) => {
      if (!result.rows[0]) return res.send('Error: No Chapter with this ID is in the database');
      if (result) return res.send(result.rows[0]);
      if (err) return res.send('error getting records from database');
    });
  } catch (err) {
    return next(new AppError(new Error('Not implemented'), 'chaptersController', 'getChapter', 500));
  }  
};

chaptersController.addChapter = async (req, res, next) => {
  const {
    name,
    street,
    city,
    state,
    zip, 
    phone,
    email
  } = req.body;

  // const {
  //   latitude,
  //   longitude
  // } = res.locals;

  try {
    // eslint-disable-next-line semi
    const text = 'SELECT name, zip FROM public.chapters WHERE name = $1 AND zip = $2'
    const values = [name, zip];
    const response = await db.query(text, values);
    if (response.rows[0]) {
      return res.send('This chapter already exists in the database');
    } else {
    // eslint-disable-next-line semi
      const text2 = 'INSERT INTO public.chapters (name, zip, street, city, state, phone, email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *'
      const values2 = [name, zip, street, city, state, phone, email];
      const addedChapter = await db.query(text2, values2);
      return res.send('Chapter added to database');
    }
  } catch (err) {
    return next(new AppError(new Error('Not implemented'), 'chaptersController', 'addChapter', 500));
  }
};

chaptersController.updateChapter = async (req, res, next) => {
  const {
    chapterId
  } = req.params;

  const {
    name,
    street,
    city,
    state,
    zip, 
    phone,
    email
  } = req.body;

  // const {
  //   latitude,
  //   longitude
  // } = res.locals;

  try {
    // eslint-disable-next-line semi
    const text = 'UPDATE public.chapters SET name = $2, street = $3, city = $4, state = $5, zip = $6, phone = $7, email = $8 WHERE id = $1'
    const values = [chapterId, name, street, city, state, zip, phone, email];
    db.query(text, values);
    return res.send('successfully updated');
  } catch (err) {
    return next(new AppError(new Error('Not implemented'), 'chaptersController', 'updateChapter', 500));
  };
};


chaptersController.deleteChapter = async (req, res, next) => {
  const {
    chapterId
  } = req.params;

  try {
    // eslint-disable-next-line semi
    const text = 'DELETE FROM public.chapters WHERE id = $1'
    const values = [chapterId];
    db.query(text, values);
    res.send('successfully deleted');

  } catch (err) {
    return next(new AppError(new Error('Not implemented'), 'chaptersController', 'deleteChapter', 500));
  }
};

chaptersController.storeTableAndColumnNames = (req, res, next) => {
  res.locals.table = 'chapters';
  res.locals.column = 'id';
  res.locals.id = req.params.chapterId;
  return next();
};

chaptersController.validateAddressInfo = (req, res, next) => {
  if (!req.body.street || !req.body.city || !req.body.state || !req.body.zip) {
    return next(new AppError(new Error('Expected street, city, state and zip to exist on request body'), 'chaptersController', 'validateAddressInfo', 400));
  }

  return next();

};

chaptersController.getGeocode = async (req, res, next) => {
  const { street, city, state, zip } = req.body;

  try {

    const [longitude, latitude] = await getGeocodeFromAddress(street, city, state, zip);
    res.locals.longitude = longitude;
    res.locals.latitude = latitude;

    return next();

  } catch (err) {
    return next(new AppError(err, 'chaptersController', 'getGeocode', 500));
  }
};


module.exports = chaptersController;