const { Client, Databases, Query } = require("appwrite");

const AppwriteClient = new Client();
const databases = new Databases(AppwriteClient); // Corrected variable name to `databases`
AppwriteClient.setEndpoint("https://cloud.appwrite.io/v1").setProject(
  "670ea1ea0016e28a21d8"
);

const fetchPosts = async (req, res) => {
  try {
    const posts = await databases.listDocuments(
      "6713a7c9001581fc5175",
      "6713ac4e0004c0f113e9",
      [Query.orderDesc("$createdAt")]
    );
    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const Search = async (req, res) => {
  const { query } = req.body;
  try {
    const posts = await databases.listDocuments(
      "6713a7c9001581fc5175",
      "6713ac4e0004c0f113e9",
      [Query.contains("caption", query)]
    );
    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  fetchPosts,
  Search,
};
