import * as express from 'express';
import * as firebase from 'firebase-admin';
import * as utils from '../utils';
export const router = express.Router();

/*
    4 Possible states for trades:
        1.  OPEN
        2.  ACCEPTED
        3.  REJECTED
        4.  CLOSED

    3 Possible states for posts
        1.  OPEN
        2.  PENDING
        3.  CLOSED

    seller: ID of post that is receiving an offer
    buyer:  ID of post that is initiating the offer

    1.  Transaction is created w/ both user's IDs and state of PENDING
*/
router.post('/:seller_:buyer', async (req: utils.Req, res: utils.Res) => {
    const [sellerPost, buyerPost, trans] = await Promise.all([
        firebase.firestore().doc(`/posts/${req.params.seller}`).get(),
        firebase.firestore().doc(`/posts/${req.params.buyer}`).get(),
        firebase.firestore().doc(`/trades/${req.params.seller}_${req.params.buyer}`).get()
    ]);

    if (!sellerPost.exists) return utils.errorRes(res, 400, `Post: ${req.params.seller} does not exist`);
    if (!buyerPost.exists) return utils.errorRes(res, 400, `Post: ${req.params.buyer} does not exist`);
    if (trans.exists) return utils.errorRes(res, 400, 'Offer already exists'); 

    if (sellerPost.data().state !== 'OPEN') return utils.errorRes(res, 400, `Post: ${req.params.seller} is not available for trading`);
    if (buyerPost.data().state !== 'OPEN') return utils.errorRes(res, 400, `Post: ${req.params.buyer} is not available for trading`);

    if (sellerPost.data().userId === buyerPost.data().userId) return utils.errorRes(res, 400, 'Cannot make offer on your own post');

    const newTransaction = {
        id: `${req.params.seller}_${req.params.buyer}`,
        seller: {
            postId: req.params.seller,
            userId: sellerPost.data().userId,
            post: sellerPost.data(),
            closed: false
        },
        buyer: {
            postId: req.params.buyer,
            userId: req.token.uid,
            post: buyerPost.data(),
            cloased: false
        },
        state: 'PENDING',
        createdAt: new Date(),
    };

    trans.ref.set(newTransaction);
    return utils.successRes(res, newTransaction);
})


/**
 * id:  ID of trade
 * 
 * Offer is accepted
 * 1.   Both posts' statuses are changed to ACCEPTED
 * 2.   Transaction record status is changed to ACCEPTED
 */
router.post('/accept/:id', async (req: utils.Req, res: utils.Res) => {
    const [sellerPostId, buyerPostId] = req.params.id.split('_');
    const [trade, sellerPost, buyerPost] = await Promise.all([
        firebase.firestore().doc(`/trades/${req.params.id}`).get(),
        firebase.firestore().doc(`/posts/${sellerPostId}`).get(),
        firebase.firestore().doc(`/posts/${buyerPostId}`).get()
    ]);

    if (!trade.exists) return utils.errorRes(res, 400, 'Transaction no longer exists');
    if (!sellerPost.exists) return utils.errorRes(res, 400, `Post: ${sellerPostId} does not exist`);
    if (!buyerPost.exists) return utils.errorRes(res, 400, `Post: ${buyerPostId} does not exist`);

    if (sellerPost.data().state !== 'OPEN') return utils.errorRes(res, 400, `Post: ${sellerPostId} is not available for trading`);
    if (buyerPost.data().state !== 'OPEN') return utils.errorRes(res, 400, `Post: ${buyerPostId} is not available for trading`);

    if (
        trade.data().seller.userId !== sellerPost.data().userId && 
        trade.data().buyer.userId !== buyerPost.data().userId
    ) return utils.errorRes(res, 401, 'Unauthorized');

    // Update the states to accepted
    const batchUpdate = firebase.firestore().batch();
    batchUpdate.update(trade.ref, 'state', 'ACCEPTED');
    batchUpdate.update(sellerPost.ref, 'state', 'PENDING');
    batchUpdate.update(buyerPost.ref, 'state', 'PENDING');
    await batchUpdate.commit();

    // Batch delete all other trade on this post
    const batchDelete = firebase.firestore().batch();
    const trades = await firebase.firestore().collection('/trades')
                                .where('state', '==', 'OPEN')
                                .where('seller.userId', '<', sellerPostId)
                                .where('seller.userId', '>', sellerPostId)
                                .get();

    trades.forEach(trade => batchDelete.delete(trade.ref));
    await batchDelete.commit();

    return utils.successRes(res, `Transaction: ${req.params.id} -- ACCEPTED`);
});

/**
 * Offer is rejected
 * 1.   Transaction record is deleted
 */
router.post('/reject/:id', async (req: utils.Req, res: utils.Res) => {
    const trade = await firebase.firestore().doc(`/trades/${req.params.id}`).get();
    if (!trade.exists) return utils.errorRes(res, 400, 'Offer does not exist');

    await trade.ref.update('state', 'REJECTED');

    return utils.successRes(res, `Transaction: ${req.params.id} -- REJECTED`);
});


/**
 * Transaction is completed
 */
router.post('/close/:id', async (req: utils.Req, res: utils.Res) => {
    const [sellerPostId, buyerPostId] = req.params.id.split('_');
    const [trade, sellerPost, buyerPost] = await Promise.all([
        firebase.firestore().doc(`/trades/${req.params.id}`).get(),
        firebase.firestore().doc(`/posts/${sellerPostId}`).get(),
        firebase.firestore().doc(`/posts/${buyerPostId}`).get()
    ]);

    if (!trade.exists) return utils.errorRes(res, 400, 'Transaction no longer exists');
    if (!sellerPost.exists) return utils.errorRes(res, 400, `Post: ${sellerPostId} does not exist`);
    if (!buyerPost.exists) return utils.errorRes(res, 400, `Post: ${buyerPostId} does not exist`);

    if (sellerPost.data().state !== 'PENDING') return utils.errorRes(res, 400, `Post: ${sellerPostId} is not available for closing`);
    if (buyerPost.data().state !== 'PENDING') return utils.errorRes(res, 400, `Post: ${buyerPostId} is not available for closing`);

    let userType = '';
    if (trade.data().seller.userId !== sellerPost.data().userId) 
        userType = 'seller';
    else if (trade.data().buyer.userId !== buyerPost.data().userId)
        userType = 'buyer';
    else
        return utils.errorRes(res, 401, 'Unauthorized');
    
    // Update the states to accepted
    const batchUpdate = firebase.firestore().batch();
    if (userType === 'seller') {
        batchUpdate.update(trade.ref, 'seller.closed', true);
        batchUpdate.update(sellerPost.ref, 'state', 'CLOSED');
        if (trade.data().buyer.closed)
            batchUpdate.update(trade.ref, 'state', 'CLOSED');
    }
    else {
        batchUpdate.update(trade.ref, 'buyer.closed', true);
        batchUpdate.update(buyerPost.ref, 'state', 'CLOSED');
        if (trade.data().seller.closed)
            batchUpdate.update(trade.ref, 'state', 'CLOSED');
    }

    await batchUpdate.commit();

    return utils.successRes(res, `Transaction: ${req.params.id} -- COMPLETED`);
});

router.get('/pending', async (req: utils.Req, res: utils.Res) => {
    try {
        return utils.successRes(res, await utils.getTransactions('PENDING', req.token.uid, req.query.buyer === 'true'));
    } catch (error) {
        return utils.errorRes(res, 500, error);
    }
});

router.get('/accepted', async (req: utils.Req, res: utils.Res) => {
    try {
        return utils.successRes(res, await utils.getTransactions('ACCEPTED', req.token.uid, req.query.buyer === 'true'));
    } catch (error) {
        return utils.errorRes(res, 500, error);
    }
});

router.get('/rejected', async (req: utils.Req, res: utils.Res) => {
    try {
        return utils.successRes(res, await utils.getTransactions('REJECTED', req.token.uid, req.query.buyer === 'true'));
    } catch (error) {
        return utils.errorRes(res, 500, error);
    }
});

router.get('/closed', async (req: utils.Req, res: utils.Res) => {
    try {
        return utils.successRes(res, await utils.getTransactions('CLOSED', req.token.uid, req.query.buyer === 'true'));
    } catch (error) {
        return utils.errorRes(res, 500, error);
    }
});