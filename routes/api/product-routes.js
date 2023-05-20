const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category },
        { model: Tag, through: ProductTag, as: 'tags' },
      ],
    });
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category },
        { model: Tag, through: ProductTag, as: 'tags' },
      ],
    });
    if (!product) {
      res.status(404).json({ message: 'No product found with this id' });
      return;
    }
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    if (req.body.tagIds && req.body.tagIds.length) {
      await product.addTags(req.body.tagIds);
      const updatedProduct = await Product.findByPk(product.id, {
        include: [
          { model: Category },
          { model: Tag, through: ProductTag, as: 'tags' },
        ],
      });
      res.status(201).json(updatedProduct);
    } else {
      res.status(201).json(product);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const product = await Product.update(req.body, {
      where: { id: req.params.id },
    });
    if (req.body.tagIds) {
      const updatedProduct = await Product.findByPk(req.params.id, {
        include: [
          { model: Category },
          { model: Tag, through: ProductTag, as: 'tags' },
        ],
      });
      await updatedProduct.setTags(req.body.tagIds);
      res.status(200).json(updatedProduct);
    } else {
      res.status(200).json(product);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.destroy({ where: { id: req.params.id } });
    if (!product) {
      res.status(404).json({ message: 'No product found with this id' });
      return;
    }
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
