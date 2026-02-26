const API_BASE = '';

// Account for roots paths are mounted on
// TODO: go through frontend endpoints and import them from here

export const api = {
	clips: {'getTopClips': '/top',
		'getVotes': '/:userId/votes',
		'getFavorites': '/:userId/favorites',
		'getComments': '/:userId/comments',
		'getHistory': '/:userId/history'
	},
	comments: {'activity': '/:userId/activity',
			'getComments': '/abc/clips/:clipId/comments',
			'postComment': '/clips/:clipId/comments', 
			'deleteComment': '/clips/:clipId/comments/:commentId',
			'patchComment': '/clips/:clipId/comments/:commentId'
	}
	favorites: {'getFavorites': '/:userId/favorites',
		'getFavoriteStatusOfClip': '/favorites/:userId/:clipId',
		'postFavorite': '/favorites',
		'deleteFavorite': '/favorites'
	}
	history: [],
	likes: [],
	users: [],
	votes: [],
	follows: []
}

