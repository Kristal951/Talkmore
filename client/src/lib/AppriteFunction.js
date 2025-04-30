import axios from "axios";
const { Client, Storage, Databases, ID, Query } = require("appwrite");

const AppwriteClient = new Client();
AppwriteClient.setEndpoint("https://cloud.appwrite.io/v1").setProject("670ea1ea0016e28a21d8");

const storage = new Storage(AppwriteClient);
const databases = new Databases(AppwriteClient);

export const uploadFile = async (file) => {
  try {
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error("File size exceeds the maximum limit of 50 MB.");
    }

    const uploadedFile = await storage.createFile("671116b10025310bdc15", ID.unique(), file);

    if (!uploadedFile) {
      throw new Error("Error creating post.");
    }

    console.log("Uploaded file details:", uploadedFile);
    return uploadedFile;
  } catch (error) {
    console.error("File upload error:", error.message || error);
    throw error;
  }
};

const deleteFileUrl = async (fileId) => {
  try {
    await storage.deleteFile("671116b10025310bdc15", fileId);
    return { message: "File deleted successfully" };
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export const getFileUrl = async (fileId) => {
  try {
    const fileUrl = await storage.getFileView("671116b10025310bdc15", fileId);
    if (!fileUrl) {
      await deleteFileUrl(fileId);
      throw new Error("File URL not available");
    }
    console.log(fileUrl);
    return fileUrl.href;
  } catch (error) {
    console.error("Error getting file URL:", error);
    throw error;
  }
};

export const getfilePrev = async (fileId) => {
  try {
    const fileUrl = await storage.getFilePreview(
      "671116b10025310bdc15", fileId, 2000, 2000, "top", 100
    );
    if (!fileUrl) {
      await deleteFileUrl(fileId);
      throw new Error("File URL not available");
    }
    return fileUrl.href;
  } catch (error) {
    console.error("Error getting file preview:", error);
    throw error;
  }
};

export const createPost = async (post) => {
  try {
    if (!post) {
      return { message: "Post data is missing" };
    }

    const { file, mimeType, userId, caption, location } = post;
    const fileType = file?.type;

    // Handle text-only post
    if (!file && mimeType?.startsWith("text/")) {
      const newPost = await databases.createDocument("6713a7c9001581fc5175", "6713ac4e0004c0f113e9", ID.unique(), {
        creator: post.creator,
        TextContent: post.TextContent,
        mimeType,
        location,
      });
      return { message: "Text post created successfully", newPost };
    }

    // If no file present for image/video
    if (!file) {
      return { message: "File is missing for media post." };
    }

    // Upload file and get URL
    const uploadedFile = await uploadFile(file);
    const fileUrl = await getFileUrl(uploadedFile.$id);

    // Handle video
    if (fileType.startsWith("video/")) {
      const newPost = await databases.createDocument("6713a7c9001581fc5175", "6713ac4e0004c0f113e9", ID.unique(), {
        creator: userId,
        caption,
        vidURL: fileUrl,
        mimeType: fileType,
        location,
        fileID: uploadedFile.$id,
      });
      return { message: "Video post created successfully", newPost };
    }

    // Handle image
    if (fileType.startsWith("image/")) {
      const newPost = await databases.createDocument("6713a7c9001581fc5175", "6713ac4e0004c0f113e9", ID.unique(), {
        creator: userId,
        caption,
        imgURL: fileUrl,
        mimeType: fileType,
        location,
        fileID: uploadedFile.$id,
      });
      return { message: "Image post created successfully", newPost };
    }

    return { message: "Unsupported file type." };
  } catch (error) {
    console.error("Error creating post:", error);
    return { message: error.message || "Internal server error" };
  }
};

export const deletePost = async (post) => {
  try {
    const documentID = post.$id;
    await databases.deleteDocument("6713a7c9001581fc5175", "6713ac4e0004c0f113e9", documentID);
    await deleteFileUrl(post.fileID);
    return { message: "File deleted successfully" };
  } catch (error) {
    console.error("Error deleting post:", error);
  }
};

export const getPostByID = async (postId) => {
  try {
    const post = await databases.getDocument("6713a7c9001581fc5175", "6713ac4e0004c0f113e9", postId);
    return post;
  } catch (error) {
    console.log("Error fetching post:", error);
    throw new Error("Unable to fetch post");
  }
};

export const getCommentsByPostID = async (postId) => {
  try {
    const comments = await databases.listDocuments("6713a7c9001581fc5175", "671b4ada0035747f596d", [Query.equal("post", postId)]);
    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Unable to fetch comments");
  }
};

export const addComment = async (payload) => {
  try {
    const { postId, userId, content } = payload;
    const newComment = await databases.createDocument("6713a7c9001581fc5175", "671b4ada0035747f596d", ID.unique(), {
      post: postId,
      creator: userId,
      content,
    });
    return newComment;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error("Unable to add comment");
  }
};

export const getUserPosts = async (userId) => {
  try {
    const response = await databases.listDocuments("6713a7c9001581fc5175", "6713ac4e0004c0f113e9", [Query.equal("creator", userId)]);
    return response.documents;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw new Error("Unable to fetch user posts");
  }
};

export const toggleLikePost = async (postId, userId) => {
  try {
    // Fetch the post
    const response = await databases.listDocuments("6713a7c9001581fc5175", "6713ac4e0004c0f113e9", [Query.equal("$id", postId)]);
    
    // Ensure post exists
    const post = response.documents[0];
    if (!post) {
      return { message: "Post not found" };
    }

    // Ensure likes array exists and toggle like status
    const likes = post.likes || [];
    const hasLiked = likes.includes(userId);
    
    if (hasLiked) {
      post.likes = likes.filter((id) => id !== userId);
    } else {
      post.likes.push(userId);
    }

    await databases.updateDocument("6713a7c9001581fc5175", "6713ac4e0004c0f113e9", postId, { likes: post.likes });

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

export const updateProfile = async (updatedUser) => {
  console.log(updatedUser)
  try {
    const { name, tag, bio, email, file, userId } = updatedUser;
    if (!userId) return ("User ID is required for updating profile");

    let updatedData = {};
    if (name) updatedData.name = name;
    if (tag) updatedData.tag = tag;
    if (bio) updatedData.Bio = bio;
    if (email) updatedData.email = email;

    if (file instanceof File) {
      const newFile = await uploadFile(file);
      const fileURL = await getFileUrl(newFile.$id);
      updatedData.imgURL = fileURL;
    }

    const response = await databases.updateDocument("6713a7c9001581fc5175", "6713a7d200190a7a8f52", userId, updatedData);

    await axios.post("http://localhost:5000/stream/updateUser", {
      userId,
      name: response.name,
      tag: response.tag,
      bio: response.Bio,
      email: response.email,
      imgUrl: response.imgURL,
    });

    console.log("Profile updated successfully:", response);
    return response;
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw error;
  }
};

export const checkIfTagExists = async (query) => {
  if (!query || query.trim().length === 0) {
    throw new Error("query cannot be empty.");
  }

  try {
    const existingTags = await databases.listDocuments("6713a7c9001581fc5175", "6713a7d200190a7a8f52", [Query.equal("tag", query)]);
    if (existingTags.total > 0) {
      return { message: "A user with this tag already exists.", status: false };
    } else {
      return { message: "This tag is available.", status: true };
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error checking tag availability.");
  }
};

export const handleDownload = async (fileId) => {
  try {
    const fileUrl = await storage.getFileDownload("671116b10025310bdc15", fileId);
    window.location.href = fileUrl.href;
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

export const queryPosts = async(query)=>{
  console.log(query);
  try{
    const posts = await databases.listDocuments("6713a7c9001581fc5175", "6713ac4e0004c0f113e9",  [
      Query.or([
        Query.contains("TextContent", query),
        Query.contains("caption", query),
        Query.contains("location", query),
      ])
    ])
    return posts;
  }catch(error){
    console.log(error);
    throw new Error("Error Searching Post.");
  }
}
