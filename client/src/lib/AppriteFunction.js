import axios from "axios";
import { Client, Storage, Databases, ID, Query } from "appwrite";
import { APPWRITE_CONFIG } from "./appwrite.config";

const AppwriteClient = new Client();
AppwriteClient.setEndpoint(APPWRITE_CONFIG.endpoint).setProject(
  APPWRITE_CONFIG.projectId
);

const storage = new Storage(AppwriteClient);
const databases = new Databases(AppwriteClient);

// ========== File Upload ==========
export const uploadFile = async (file) => {
  try {
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize)
      throw new Error("File size exceeds the maximum limit of 50 MB.");

    const uploadedFile = await storage.createFile(
      APPWRITE_CONFIG.fileBucketId,
      ID.unique(),
      file
    );
    if (!uploadedFile) throw new Error("Error uploading file.");

    return uploadedFile;
  } catch (error) {
    console.error("File upload error:", error.message || error);
    throw error;
  }
};

const deleteFileUrl = async (fileId) => {
  try {
    await storage.deleteFile(APPWRITE_CONFIG.fileBucketId, fileId);
    return { message: "File deleted successfully" };
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export const getFileUrl = async (fileId) => {
  try {
    const fileUrl = await storage.getFileView(
      APPWRITE_CONFIG.fileBucketId,
      fileId
    );
    if (!fileUrl) {
      await deleteFileUrl(fileId);
      throw new Error("File URL not available");
    }
    return fileUrl.href;
  } catch (error) {
    console.error("Error getting file URL:", error);
    throw error;
  }
};

export const getfilePrev = async (fileId) => {
  try {
    await storage.getFile(APPWRITE_CONFIG.fileBucketId, fileId);
    return `${APPWRITE_CONFIG.endpoint}/storage/buckets/${APPWRITE_CONFIG.fileBucketId}/files/${fileId}/view?project=${APPWRITE_CONFIG.projectId}`;
  } catch (error) {
    console.error("Error getting file preview:", error);
    throw new Error("Failed to retrieve file URL.");
  }
};

// ========== Post Logic ==========
export const createPost = async (post) => {
  try {
    if (!post) return { message: "Post data is missing" };

    const { file, mimeType, userId, caption, location } = post;
    const fileType = file?.type;

    if (!file && mimeType?.startsWith("text/")) {
      const newPost = await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.postCollectionId,
        ID.unique(),
        {
          creator: post.creator,
          TextContent: post.TextContent,
          mimeType,
          location,
        }
      );
      return { message: "Text post created successfully", newPost };
    }

    if (!file) return { message: "File is missing for media post." };

    const uploadedFile = await uploadFile(file);
    const fileUrl = await getFileUrl(uploadedFile.$id);

    const payload = {
      creator: userId,
      caption,
      mimeType: fileType,
      location,
      fileID: uploadedFile.$id,
    };

    if (fileType.startsWith("video/")) {
      payload.vidURL = fileUrl;
    } else if (fileType.startsWith("image/")) {
      payload.imgURL = fileUrl;
    } else {
      return { message: "Unsupported file type." };
    }

    const newPost = await databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.postCollectionId,
      ID.unique(),
      payload
    );
    return {
      message: `${
        fileType.startsWith("video/") ? "Video" : "Image"
      } post created successfully`,
      newPost,
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return { message: error.message || "Internal server error" };
  }
};

export const deletePost = async (post) => {
  try {
    await databases.deleteDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.postCollectionId,
      post.$id
    );
    await deleteFileUrl(post.fileID);
    return { message: "Post and file deleted successfully" };
  } catch (error) {
    console.error("Error deleting post:", error);
  }
};

export const getPostByID = async (postId) => {
  try {
    return await databases.getDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.postCollectionId,
      postId
    );
  } catch (error) {
    console.log("Error fetching post:", error);
    throw new Error("Unable to fetch post");
  }
};

export const getCommentsByPostID = async (postId) => {
  try {
    return await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.commentCollectionId,
      [Query.equal("post", postId)]
    );
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Unable to fetch comments");
  }
};

export const addComment = async ({ postId, userId, content }) => {
  try {
    return await databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.commentCollectionId,
      ID.unique(),
      {
        post: postId,
        creator: userId,
        content,
      }
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error("Unable to add comment");
  }
};

export const getUserPosts = async (userId) => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.postCollectionId,
      [Query.equal("creator", userId)]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw new Error("Unable to fetch user posts");
  }
};

export const toggleLikePost = async (postId, userId) => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.postCollectionId,
      [Query.equal("$id", postId)]
    );
    const post = response.documents[0];
    if (!post) return { message: "Post not found" };

    const likes = post.likes || [];
    const hasLiked = likes.includes(userId);
    post.likes = hasLiked
      ? likes.filter((id) => id !== userId)
      : [...likes, userId];

    await databases.updateDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.postCollectionId,
      postId,
      { likes: post.likes }
    );

    return {
      isLiked: !hasLiked,
      likeCount: post.likes.length,
      message: hasLiked ? "Post unliked" : "Post liked",
    };
  } catch (error) {
    console.error("Error toggling like:", error);
    return { message: "Internal server error" };
  }
};

// ========== User ==========
export const updateProfile = async (updatedUser) => {
  try {
    const { name, tag, bio, email, file, userId } = updatedUser;
    if (!userId) throw new Error("User ID is required for updating profile");

    const updatedData = {
      ...(name && { name }),
      ...(tag && { tag }),
      ...(bio && { Bio: bio }),
      ...(email && { email }),
    };

    if (file instanceof File) {
      const newFile = await uploadFile(file);
      updatedData.imgURL = await getFileUrl(newFile.$id);
    }

    const response = await databases.updateDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.userCollectionId,
      userId,
      updatedData
    );

    await axios.post("http://localhost:5000/stream/updateUser", {
      userId,
      name: response.name,
      tag: response.tag,
      bio: response.Bio,
      email: response.email,
      imgUrl: response.imgURL,
    });

    return response;
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw error;
  }
};

export const checkIfTagExists = async (query) => {
  if (!query || query.trim().length === 0)
    throw new Error("query cannot be empty.");

  try {
    const existingTags = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.userCollectionId,
      [Query.equal("tag", query)]
    );
    return {
      message:
        existingTags.total > 0
          ? "A user with this tag already exists."
          : "This tag is available.",
      status: existingTags.total === 0,
    };
  } catch (error) {
    console.log(error);
    throw new Error("Error checking tag availability.");
  }
};

// ========== Search ==========
export const handleDownload = async (fileId) => {
  try {
    const fileUrl = await storage.getFileDownload(
      APPWRITE_CONFIG.fileBucketId,
      fileId
    );
    window.location.href = fileUrl.href;
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

export const queryPosts = async (query) => {
  try {
    return await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.postCollectionId,
      [
        Query.or([
          Query.contains("TextContent", query),
          Query.contains("caption", query),
          Query.contains("location", query),
        ]),
      ]
    );
  } catch (error) {
    console.log(error);
    throw new Error("Error Searching Post.");
  }
};

export const ReportPost = async (postId, userId, reason, comment) => {
  try {
    await databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.reportCollectionId,
      ID.unique(),
      {
        reporterID: userId,
        postID: postId,
        reason,
        comment,
        status: "pending",
      }
    );

    return { text: "Message reported successfully.", status: true };
  } catch (error) {
    console.error("Error reporting post:", error);
    return { text: "Failed to report the message.", status: false };
  }
};

export const queryUsers = async (query) => {
  try {
    const users = await axios.post("http://localhost:5000/user/searchUser", {
      query,
    });
    return users?.data?.users || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const queryChannels = async (query) => {
  try {
    const channels = await axios.post(
      "http://localhost:5000/stream/searchChannels",
      { query }
    );
    return channels?.data || [];
  } catch (error) {
    console.error("Error fetching channels:", error);
    return [];
  }
};

export const queryUsersTag = async (query) => {
  try {
    const users = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.userCollectionId,
      [Query.contains("tag", query)]
    );

    if (users.total === 0) return [];

    return users.documents;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
