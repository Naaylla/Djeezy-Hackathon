'use strict';

const { Contract } = require('fabric-contract-api');

class DonationContract extends Contract {

    async initLedger(ctx) {
        console.log('Initializing Ledger...');
    }

    async donate(ctx, donorID, receiverName, amount) {
        const donationID = ctx.stub.createCompositeKey('Donation', [donorID, Date.now().toString()]);
        const donation = {
            donorID, // Anonymous ID
            receiverName,
            amount,
            timestamp: new Date().toISOString()
        };

        await ctx.stub.putState(donationID, Buffer.from(JSON.stringify(donation)));
        return JSON.stringify(donation);
    }

    async getReceiverDonations(ctx, receiverName) {
        const iterator = await ctx.stub.getStateByPartialCompositeKey('Donation', []);
        const donations = [];

        for await (const res of iterator) {
            const donation = JSON.parse(res.value.toString());
            if (donation.receiverName === receiverName) {
                donations.push(donation);
            }
        }

        return JSON.stringify(donations);
    }

    async getDonorDonations(ctx, donorID) {
        const iterator = await ctx.stub.getStateByPartialCompositeKey('Donation', []);
        const donations = [];

        for await (const res of iterator) {
            const donation = JSON.parse(res.value.toString());
            if (donation.donorID === donorID) {
                donations.push(donation);
            }
        }

        return JSON.stringify(donations);
    }
}

module.exports = DonationContract;
