import dbConnect from "../../../utils/dbConnect";
import Listing from "../../../models/Listing";

export default async function handler(req, res) {
  const {
    query: { slug },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const listing = await Listing.find({ game_slug: slug });
        if (!listing) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: listing });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "PUT" /* Edit a model by its ID */:
      try {
        const listing = await Listing.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!listing) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: listing });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE" /* Delete a model by its ID */:
      try {
        const deletedListing = await Listing.deleteOne({ _id: id });
        if (!deletedListing) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
