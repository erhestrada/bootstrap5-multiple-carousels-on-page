const API_BASE = '';

export const api = {
	clips: [],
	comments: {'activity': '/:userId/activity',
			'getComments': '/abc/clips/:clipId/comments',
			'postComment': '/clips/:clipId/comments', 
			'deleteComment': '/clips/:clipId/comments/:commentId',
			'patchComment': '/clips/:clipId/comments/:commentId'
	}
	favorites: [],
	history: [],
	likes: [],
	users: [],
	votes: []
}

