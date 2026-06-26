const mongoose = require("mongoose");
require("dotenv").config();

// paste your mongo URL directly here if .env is not working
const MONGO_URL = process.env.ATLASDB_URL || process.env.MONGO_URL;

async function migrate() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");

  const db = mongoose.connection.db;
  const listings = await db.collection("listings").find({}).toArray();

  console.log(`Total listings found: ${listings.length}`);

  let migrated = 0;
  let skipped = 0;

  for (let listing of listings) {
    const hasOldImage = listing.image && listing.image.url;
    const hasNewImages = listing.images && listing.images.length > 0;

    if (hasOldImage && !hasNewImages) {
      // migrate old image -> images array
      await db.collection("listings").updateOne(
        { _id: listing._id },
        {
          $set: {
            images: [{ url: listing.image.url, filename: listing.image.filename || "" }]
          }
        }
      );
      console.log(`✅ Migrated: ${listing.title}`);
      migrated++;
    } else if (hasNewImages) {
      console.log(`⏭️  Skipped (already has images): ${listing.title}`);
      skipped++;
    } else {
      console.log(`⚠️  No image found for: ${listing.title}`);
      skipped++;
    }
  }

  console.log(`\nDone! Migrated: ${migrated}, Skipped: ${skipped}`);
  await mongoose.connection.close();
}

migrate().catch(console.error);