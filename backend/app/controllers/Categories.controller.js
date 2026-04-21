// backend/app/controllers/Category.controller.js
const db = require("../models");
const Category = db.Category;

exports.create = async (req, res) => {
  try { res.status(201).send(await Category.create(req.body)); } 
  catch (e) { res.status(500).send({ message: e.message }); }
};
exports.findAll = async (_req, res) => {
  try { res.send(await Category.findAll()); } 
  catch (e) { res.status(500).send({ message: e.message }); }
};
exports.findOne = async (req, res) => {
  try { const item = await Category.findByPk(req.params.id); item ? res.send(item) : res.status(404).send({ message: "Not found" }); } 
  catch (e) { res.status(500).send({ message: e.message }); }
};
exports.update = async (req, res) => {
  try { const result = await Category.update(req.body, { where: { id: req.params.id } }); result[0] ? res.send({ message: "Updated" }) : res.status(404).send({ message: "Not found" }); } 
  catch (e) { res.status(500).send({ message: e.message }); }
};
exports.delete = async (req, res) => {
  try { const result = await Category.destroy({ where: { id: req.params.id } }); result ? res.send({ message: "Deleted" }) : res.status(404).send({ message: "Not found" }); } 
  catch (e) { res.status(500).send({ message: e.message }); }
};