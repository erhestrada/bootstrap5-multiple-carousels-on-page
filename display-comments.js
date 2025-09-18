import { getComments } from "./comments";

// Need to do more stuff, like comment-handler
export async function displayComments() {
    const comments = await getComments(window.currentClip.id);
    console.log(comments);
    return comments;
}
