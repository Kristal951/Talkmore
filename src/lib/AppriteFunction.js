const { Client, Storage, Databases, ID, Query } = require("appwrite");
const AppwriteClient = new Client();
AppwriteClient
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('670ea1ea0016e28a21d8');

const storage = new Storage(AppwriteClient);
const databases = new Databases(AppwriteClient);

export const uploadFile = async (file) => {
    try {
       
        const maxSize = 50 * 1024 * 1024; 
        if (file.size > maxSize) {
            throw new Error('File size exceeds the maximum limit of 50 MB.');
        }

        // Optional: Check MIME type
        // const allowedTypes = ['video/mp4', 'video/x-matroska']; // Add more types as needed
        // if (!allowedTypes.includes(file.type)) {
        //     throw new Error('Unsupported file type. Please upload a valid video file.');
        // }

        const uploadedFile = await storage.createFile(
            '671116b10025310bdc15', 
            ID.unique(), 
            file
        );

        if (!uploadedFile) {
            throw new Error('Error creating post.');
        }

        console.log("Uploaded file details:", uploadedFile); // Log uploaded file details
        return uploadedFile; 
    } catch (error) {
        console.error('File upload error:', error.message || error);
        throw error; 
    }
};


const deleteFileUrl = async (fileId) => {
    try {
        await storage.deleteFile(
            '671116b10025310bdc15',
            fileId
        );
        return { message: 'File deleted successfully' };
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
};

export const getFileUrl = async (fileId) => {
    try {
        const fileUrl = await storage.getFileView(
            '671116b10025310bdc15', 
            fileId,
        );
        if (!fileUrl) {
            await deleteFileUrl(fileId);
            throw new Error('File URL not available');
        }
        // 2000,
        //     2000,
        //     "top",
        //     100
        console.log(fileUrl);
        return fileUrl.href;
    } catch (error) {
        console.error('Error getting file URL:', error);
        throw error;
    }
};

export const createPost = async (post) => {
    try {
        if (!post || !post.file) {
            return { message: "Post data or file is missing" };
        }

        const uploadedFile = await uploadFile(post.file);
    
        const fileUrl = await getFileUrl(uploadedFile.$id); 
        console.log(uploadedFile.$id);

        const fileType = post.file.type;

        if (fileType && fileType.startsWith('video/')) {
            const newPost = await databases.createDocument(
                '6713a7c9001581fc5175', 
                '6713ac4e0004c0f113e9',
                ID.unique(), 
                {
                    creator: post.userId,
                    caption: post.caption,
                    vidURL: fileUrl, 
                    mimeType: fileType, 
                    tags: post.tags ? post.tags.replace(/ /g, '').split(',') : [], 
                    location: post.location,
                    fileID: uploadedFile.$id
                }
            );
            return { message: "Video post created successfully", newPost };
        }

        // Handle non-video files (e.g., images)
        const newPost = await databases.createDocument(
            '6713a7c9001581fc5175', 
            '6713ac4e0004c0f113e9',
            ID.unique(), // Unique document ID
            {
                creator: post.userId,
                caption: post.caption,
                imgURL: fileUrl, // Store image URL
                mimeType: fileType, // Use post.file.type for MIME type
                tags: post.tags ? post.tags.replace(/ /g, '').split(',') : [], // Split tags into array (fixed typo)
                location: post.location, // Ensure you're passing this value in `post`
                fileID: uploadedFile.$id
            }
        );
        return { message: "Image post created successfully", newPost };

    } catch (error) {
        console.error('Error creating post:', error);
        return { message: error.message || 'Internal server error' };
    }
};

export const deletePost = async(post)=>{
    try {
        const documentID = post.$id
        await databases.deleteDocument(
            '6713a7c9001581fc5175', 
            '6713ac4e0004c0f113e9',
            documentID
        )
        await deleteFileUrl(post.fileID)
        return { message: 'File deleted successfully' };
    } catch (error) {
        console.error('Error deleting file:', error);
    }
}

export  const getPostByID = async (postId) => {
            try {
                const post = await databases.getDocument(
                    '6713a7c9001581fc5175',
                    '6713ac4e0004c0f113e9', 
                    postId                   
                );
                return post;  
            } catch (error) {
                console.log('Error fetching post:', error);
                throw new Error('Unable to fetch post'); 
            }
        };

export const getCommentsByPostID= async(postId)=>{
    try {
        const comments = databases.listDocuments(
            '6713a7c9001581fc5175',
            '671b4ada0035747f596d', 
            [Query.equal("post", postId)]
        )
        return comments;
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw new Error('Unable to fetch comments');
    }
}

export const addComment = async (payload) => {
    try {
        const {postId, userId, content} = payload
        const newComment = await databases.createDocument(
            '6713a7c9001581fc5175',
            '671b4ada0035747f596d', 
            ID.unique(), 
            {
                post: postId,
                creator: userId,
                content: content,
            }
        );
        return newComment;
    } catch (error) {
        console.error('Error adding comment:', error);
        throw new Error('Unable to add comment');
    }
}
export const getUserPosts = async (userId) => {
    try {
        const response = await databases.listDocuments(
            '6713a7c9001581fc5175', 
            '6713ac4e0004c0f113e9',
            [Query.equal('creator', userId)] 
        );
        return response.documents; 
    } catch (error) {
        console.error('Error fetching user posts:', error);
        throw new Error('Unable to fetch user posts');
    }
};