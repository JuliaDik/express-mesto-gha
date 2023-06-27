const router = require('express').Router();

const { getCards, createCard, deleteCardById } = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:id', deleteCardById);

module.exports = router;
