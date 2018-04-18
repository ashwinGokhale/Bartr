import * as express from 'express';
import * as firebase from 'firebase-admin';
import * as utils from '../utils';
export const router = express.Router();


router.get('/', (req: utils.Req, res) => {
    const token: firebase.auth.DecodedIdToken = req.token;
    console.log('Token:', token);
    res.send('Trades Page\nToken:'+ req.token);
});

/*
    trader: ID of post that is receiving an offer
    buyer:  ID of post that is initiating the offer

    1.  Transaction is created w/ both user's IDs and state of PENDING
*/
router.post('/:trader-:buyer', (req, res) => {
    
    const taRef = firebase.firestore().doc(`/transactions/${req.params.trader}_${req.params.buyer}`);
    const newTransaction = {
        trader: {
            post: req.params.trader
        },
        buyer: {
            post: req.params.buyer
        }
    };
    res.send(req.params);
})


/**
 * Offer is accepted
 * 1.   Both posts' statuses are changed to ACCEPTED
 * 2.   Transaction record status is changed to ACCEPTED
 */
router.post('/accept/:id', (req, res) => {
    res.send('Accepted Offer')
});

/**
 * Offer is rejected
 * 1.   Transaction record is deleted
 */
router.post('/reject/:id', (req, res) => {
    res.send('Accepted Offer')
});


/**
 * Transaction is completed
 */
router.post('/complete/:id', (req, res) => {

})

router.get('/accepted', (req, res) => {
    res.send('Accepted Offers:')
});

router.get('/rejected', (req, res) => {
    res.send('Rejected Offers')
});