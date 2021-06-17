const {Router} = require('express'); // Import router object
const router = Router(); // Create object of router

/* Description of specific page path */
router.get('/', (req, res) => {
    res.render('index', {
        title: 'Main page',
        isHome: true
    });
})

module.exports = router; //export created router