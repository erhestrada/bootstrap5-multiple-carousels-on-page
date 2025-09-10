import { getNetVotes } from './votes/get-net-votes.js'

export async function displayNetVotes(clipId) {
    const netVotes = await getNetVotes(clipId);
    const netVotesElement = document.getElementById('net-votes');
    netVotesElement.textContent = netVotes;
}